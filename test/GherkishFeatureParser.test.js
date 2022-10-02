import * as fs from 'node:fs';
import * as path from 'node:path';
import { deepStrictEqual as deq } from 'node:assert';
import zunit from 'zunit';
import GherkishFeatureParser from '../index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('FeatureParser', () => {
  it('should parse English by default', () => {
    const file = readFeatureFile('buck-rogers-season-one.feature');
    const parser = new GherkishFeatureParser();
    const feature = parser.parse(file);

    deq(feature, {
      annotations: [
        { name: 'only', value: true },
        { name: 'library', value: 'Buck Rogers Common' },
        { name: 'library', value: 'Buck Rogers Season One' },
      ],
      title: 'Buck Rogers - Season One',
      description: undefined,
      background: {
        annotations: [
          { name: 'timeout', value:'5000' },
        ],
        title: 'Introduction',
        description: undefined,
        steps: [
          {
            annotations: [],
            text: 'Given the year is 1987',
            generalised: 'Given the year is 1987',
            docString: '',
          },
          {
            annotations: [],
            text: 'And NASA launches the last of America\'s deep space probes',
            generalised: 'And NASA launches the last of America\'s deep space probes',
            docString: '',
          },
          {
            annotations: [
              { name: 'skip', value: true },
            ],
            text: 'When a freak mishap occurs',
            generalised: 'When a freak mishap occurs',
            docString: '',
          },
          {
            annotations: [],
            text: 'Then Buck Rogers is blown out of his trajectory into an orbit which freezes his life support systems',
            generalised: 'Then Buck Rogers is blown out of his trajectory into an orbit which freezes his life support systems',
            docString: '',
          },
          {
            annotations: [],
            text: 'And returns Buck Rogers to Earth 500 years later',
            generalised: 'And returns Buck Rogers to Earth 500 years later',
            docString: '',
          },
        ],
      },
      scenarios: [
        {
          title: 'Awakening',
          description: undefined,
          annotations: [
            { name: 'skip', value: true },
          ],
          steps: [
            {
              annotations: [],
              text: 'Given the Draconians have planted a homing beacon aboard Buck\'s shuttle',
              generalised: 'Given the Draconians have planted a homing beacon aboard Buck\'s shuttle',
              docString: '',
            },
            {
              annotations: [],
              text: 'When Buck arrives on Earth',
              generalised: 'When Buck arrives on Earth',
              docString: '',
            },
            {
              annotations: [],
              text: 'Then he must adjust to the 25th century',
              generalised: 'Then he must adjust to the 25th century',
              docString: '',
            },
            {
              annotations: [],
              text: 'And convince the Earth Defense Directorate that the Draconians are secretly planning to conquer them',
              generalised: 'And convince the Earth Defense Directorate that the Draconians are secretly planning to conquer them',
              docString: '',
            },
          ],
        },
      ],
    });
  });
});

function readFeatureFile(filename) {
  const filepath = path.join('test', 'specifications', 'en', filename);
  return fs.readFileSync(filepath, 'utf-8');
}