import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Languages } from '../../lib/index.js';

const { describe, it, xdescribe, xit, before, beforeEach, after, afterEach } = zunit;
const { Pirate } = Languages;

describe('Pirate', () => {
  it('should map keywords', () => {
    deq(Pirate.regexp('feature'), /^\s*(?:tale|yarn)\s*:\s*(.*)/i);
    deq(Pirate.regexp('background'), /^\s*(?:lore)\s*:\s*(.*)/i);
    deq(Pirate.regexp('scenario'), /^\s*(?:adventure|sortie)\s*:\s*(.*)/i);
  });
});
