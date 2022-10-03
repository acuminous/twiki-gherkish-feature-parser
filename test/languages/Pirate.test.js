import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Languages } from '../../lib/index.js';

const { describe, it, xdescribe, xit, before, beforeEach, after, afterEach } = zunit;
const { Pirate } = Languages;

describe('Pirate', () => {
  it('should generalise text', () => {
    eq(Pirate.generalise('Giveth A'), 'A');
    eq(Pirate.generalise('Whence A'), 'A');
    eq(Pirate.generalise('Thence A'), 'A');
  });

  it('should answer to name', () => {
    eq(Pirate.answersToName('Pirate'), true);
    eq(Pirate.answersToName('pirate'), true);
    eq(Pirate.answersToName('other'), false);
  });

  it("should have no code (they're more guidelines really)", () => {
    eq(Pirate.answersToCode(null), false);
    eq(Pirate.answersToCode(undefined), false);
    eq(Pirate.answersToCode(''), false);
    eq(Pirate.answersToCode('other'), false);
  });
});
