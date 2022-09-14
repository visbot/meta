import test from 'ava';
import { promises as fs } from 'node:fs';
import { parse as parseYaml } from 'yaml';

const dataSet = parseYaml(await fs.readFile('src/catalogue.yml', 'utf-8'));

test('Unique IDs', t => {
    const ids = [];
    
    dataSet.forEach(item => {
        if (ids.includes(item.id)) {
            t.fail(`Duplicate ID found: ${item.id}`)
        }

        ids.push(item.id);
    });

    t.is(ids.length, dataSet.length);
});

test('Valid pack type', t => {
    const validTypes = [
        'album',
        'compilation',
        'single'
    ];

    const actual = dataSet.map(item => {
        if (!validTypes.includes(item.type)) {
            t.fail(`Invalid pack type found: ${item.id}`)
        }

        return item;
    });

    t.is(actual.length, dataSet.length);
});

test('Has required fields', t => {
    const actual = dataSet.map((item, index) => {
        const keys = Object.keys(item);

        if (!keys.includes('id')) {
            t.fail(`Missing key "id" at index ${item.id ?? index}`);
        } else if (typeof item.id !== 'string') {
            t.fail(`Invalid type for "id": ${item.id ?? index}`);
        }

        if (!keys.includes('name')) {
            t.fail(`Missing key "name": ${item.id ?? index}`);
        } else if (typeof item.name !== 'string') {
            t.fail(`Invalid type for "name": ${item.id ?? index}`);
        }

        if (!keys.includes('type')) {
            t.fail(`Missing key "type": ${item.id ?? index}`);
        } else if (typeof item.type !== 'string') {
            t.fail(`Invalid type for "type": ${item.id}`);
        }

        if (!keys.includes('artists')) {
            t.fail(`Missing key "artists": ${item.id ?? index}`);
        } else if (!Array.isArray(item.artists)) {
            t.fail(`Invalid type for "type": ${item.id ?? index}`);
        }

        return item;
    });

    t.is(actual.length, dataSet.length);
});

test('Unique playlist IDs', t => {
    const ids = [];
    const packWithVideo = dataSet.filter(item => item.playlist);
    
    packWithVideo.forEach(item => {
        if (ids.includes(item.id)) {
            t.fail(`Duplicate playlist ID found: ${item.id}`)
        }

        ids.push(item.id);
    });

    t.is(ids.length, packWithVideo.length);
});