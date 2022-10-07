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

        throw new TypeError(`Duplicate ID found: ${item.id}`);
    });

    assert.is(actual.length, dataSet.length);
});

test('Valid ID pattern', () => {
    const actual = [];
    
    dataSet.forEach(item => {
        if (!/^V(A|B|C|D|E)\d{3}(-\d)?$/.test(item.id)) {
            throw new TypeError(`Invalid pack type foun": ${item.id}`);
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
            throw new TypeError(`Invalid pack type foun": ${item.id}`);
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
            throw new TypeError(`Missing key "id" at index ${item.id ?? index}`);
        } else if (typeof item.id !== 'string') {
            throw new TypeError(`Invalid type for "id": ${item.id ?? index}`);
        }

        if (!keys.includes('name')) {
            throw new TypeError(`Missing key "name": ${item.id ?? index}`);
        } else if (typeof item.name !== 'string') {
            throw new TypeError(`Invalid type for "name": ${item.id ?? index}`);
        }

        if (!keys.includes('type')) {
            throw new TypeError(`Missing key "type": ${item.id ?? index}`);
        } else if (typeof item.type !== 'string') {
            throw new TypeError(`Invalid type for "type": ${item.id}`);
        }

        if (!keys.includes('artists')) {
            throw new TypeError(`Missing key "artists": ${item.id ?? index}`);
        } else if (!Array.isArray(item.artists)) {
            throw new TypeError(`Invalid type for "type": ${item.id ?? index}`);
        }

        actual.push(item);
    });

    assert.is(actual.length, dataSet.length);
});

test('Unique playlist IDs', () => {
    const ids = [];
    const packWithVideo = dataSet.filter(item => item.playlist);
    
    packWithVideo.forEach(item => {
        if (ids.includes(item.playlist)) {
            throw new TypeError(`Duplicate playlist ID "${item.playlist}" found: ${item.id}`);
        }

        ids.push(item.playlist);
    });

    assert.is(ids.length, packWithVideo.length);
});

test('Valid artist', () => {
    const validArtists = [
        // founding members
        'alt-iii',
        'avs-king',
        'duo',
        'dynamic-duo',
        'nemo-orange',
        'skupers',
        'yathosho',

        // joined members
        'amphirion',
        'danaughty1',
        'effekthasch',
        'frames-of-reality',
        'grandchild',
        'hboy',
        'javs',
        'les-noobiens',
        'micro-d',
        'onionring',
        'pan-am',
        'pure-krypton',
        'synth-c',
        'vanish',
        'zamuz',

        // non-members
        'anotherversion',
        'drew',
        'finnish-flash',
        'littlebuddy',
        'tonic',
        'unconed',
        'unripe-lemon',
        
        // generic names
        'various-artists'
    ];

    const actual = [];
    
    dataSet.forEach(item => {
        item.artists.map(artist => {
            if (!validArtists.includes(artist)) {
                throw new TypeError(`Invalid artist "${artist}" found: ${item.id}`);
            }
        });
        
        actual.push(item);
    });

    assert.is(actual.length, dataSet.length);
});

test.run();