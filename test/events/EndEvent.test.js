import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { EndEvent } = Events;

describe('EndEvent', () => {
  it('should test end of feature', () => {
    const event = new EndEvent();

    eq(event.test({ line: '\u0000' }), true);

    eq(event.test({ line: ' \u0000' }), false);
    eq(event.test({ line: '\u0000 ' }), false);
  });

  it('should interpret end of feature', () => {
    const event = new EndEvent();

    eq(event.interpret({ line: '\u0000' }), undefined);
  });
});
