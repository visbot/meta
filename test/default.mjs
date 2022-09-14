import test from 'ava';
import { promises as fs } from 'node:fs';
import { parse as parseYaml } from 'yaml';

const dataSet = parseYaml(await fs.readFile('src/catalogue.yml', 'utf-8'));

test('Unique IDs', t => {
    const actual = [];
    
    dataSet.forEach(item => {
        if (!actual.includes(item.id)) {
            actual.push(item.id);
            return;
        }

        t.log(`Duplicate ID found: ${item.id}`);
    });

    t.is(actual.length, dataSet.length);
});

test('Valid ID pattern', t => {
    const actual = [];
    
    dataSet.forEach(item => {
        if (!/^V(A|B|C|D|E)\d{3}(-\d)?$/.test(item.id)) {
            t.log(`Invalid pack type found: ${item.id}`);
            return;
        }

        actual.push(item);
    });

    t.is(actual.length, dataSet.length);
});

test('Valid pack type', t => {
    const validTypes = [
        'album',
        'compilation',
        'single'
    ];

    const actual = [];
    
    dataSet.forEach(item => {
        if (!validTypes.includes(item.type)) {
            t.log(`Invalid pack type found: ${item.id}`);
            return;
        }

        actual.push(item);
    });

    t.is(actual.length, dataSet.length);
});

test('Has required fields', t => {
    const actual = [];
    
    dataSet.map((item, index) => {
        const keys = Object.keys(item);

        if (!keys.includes('id')) {
            t.log(`Missing key "id" at index ${item.id ?? index}`);
            return;
        } else if (typeof item.id !== 'string') {
            t.log(`Invalid type for "id": ${item.id ?? index}`);
            return;
        }

        if (!keys.includes('name')) {
            t.log(`Missing key "name": ${item.id ?? index}`);
            return;
        } else if (typeof item.name !== 'string') {
            t.log(`Invalid type for "name": ${item.id ?? index}`);
            return;
        }

        if (!keys.includes('type')) {
            t.log(`Missing key "type": ${item.id ?? index}`);
            return;
        } else if (typeof item.type !== 'string') {
            t.log(`Invalid type for "type": ${item.id}`);
            return;
        }

        if (!keys.includes('artists')) {
            t.log(`Missing key "artists": ${item.id ?? index}`);
            return;
        } else if (!Array.isArray(item.artists)) {
            t.log(`Invalid type for "type": ${item.id ?? index}`);
            return;
        }

        actual.push(item);
    });

    t.is(actual.length, dataSet.length);
});

test('Unique playlist IDs', t => {
    const ids = [];
    const packWithVideo = dataSet.filter(item => item.playlist);
    
    packWithVideo.forEach(item => {
        if (ids.includes(item.id)) {
            t.log(`Duplicate playlist ID found: ${item.id}`);
            return;
        }

        ids.push(item.id);
    });

    t.is(ids.length, packWithVideo.length);
});