import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Languages } from '../../lib/index.js';

const { describe, it, xdescribe, xit, before, beforeEach, after, afterEach } = zunit;
const { Pirate } = Languages;

describe('Pirate', () => {
  it('should generalise text', () => {
    eq(new Pirate().generalise('Giveth A'), 'A');
    eq(new Pirate().generalise('Whence A'), 'A');
    eq(new Pirate().generalise('Thence A'), 'A');
  });

  it('should answer to name', () => {
    eq(new Pirate().answersToName('Pirate'), true);
    eq(new Pirate().answersToName('pirate'), true);
    eq(new Pirate().answersToName('other'), false);
  });

  it("should have no code (they're more guidelines really)", () => {
    eq(new Pirate().answersToCode(null), false);
    eq(new Pirate().answersToCode(undefined), false);
    eq(new Pirate().answersToCode(''), false);
    eq(new Pirate().answersToCode('other'), false);
  });
});
