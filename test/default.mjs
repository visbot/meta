import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { promises as fs } from 'node:fs';
import { parse as parseYaml } from 'yaml';

const dataSet = parseYaml(await fs.readFile('src/catalogue.yml', 'utf-8'));

test('Unique IDs', () => {
    const actual = [];
    
    dataSet.forEach(item => {
        if (!actual.includes(item.id)) {
            actual.push(item.id);
            return;
        }

        console.log(`Duplicate ID found: ${item.id}`);
    });

    assert.is(actual.length, dataSet.length);
});

test('Valid ID pattern', () => {
    const actual = [];
    
    dataSet.forEach(item => {
        if (!/^V(A|B|C|D|E)\d{3}(-\d)?$/.test(item.id)) {
            console.log(`Invalid pack type found: ${item.id}`);
            return;
        }

        actual.push(item);
    });

    assert.is(actual.length, dataSet.length);
});

test('Valid pack type', () => {
    const validTypes = [
        'album',
        'compilation',
        'single'
    ];

    const actual = [];
    
    dataSet.forEach(item => {
        if (!validTypes.includes(item.type)) {
            console.log(`Invalid pack type found: ${item.id}`);
            return;
        }

        actual.push(item);
    });

    assert.is(actual.length, dataSet.length);
});

test('Has required fields', () => {
    const actual = [];
    
    dataSet.map((item, index) => {
        const keys = Object.keys(item);

        if (!keys.includes('id')) {
            console.log(`Missing key "id" at index ${item.id ?? index}`);
            return;
        } else if (typeof item.id !== 'string') {
            console.log(`Invalid type for "id": ${item.id ?? index}`);
            return;
        }

        if (!keys.includes('name')) {
            console.log(`Missing key "name": ${item.id ?? index}`);
            return;
        } else if (typeof item.name !== 'string') {
            console.log(`Invalid type for "name": ${item.id ?? index}`);
            return;
        }

        if (!keys.includes('type')) {
            console.log(`Missing key "type": ${item.id ?? index}`);
            return;
        } else if (typeof item.type !== 'string') {
            console.log(`Invalid type for "type": ${item.id}`);
            return;
        }

        if (!keys.includes('artists')) {
            console.log(`Missing key "artists": ${item.id ?? index}`);
            return;
        } else if (!Array.isArray(item.artists)) {
            console.log(`Invalid type for "type": ${item.id ?? index}`);
            return;
        }

        actual.push(item);
    });

    assert.is(actual.length, dataSet.length);
});

test('Unique playlist IDs', () => {
    const ids = [];
    const packWithVideo = dataSet.filter(item => item.playlist);
    
    packWithVideo.forEach(item => {
        if (ids.includes(item.id)) {
            console.log(`Duplicate playlist ID found: ${item.id}`);
            return;
        }

        ids.push(item.id);
    });

    assert.is(ids.length, packWithVideo.length);
});

test.run();