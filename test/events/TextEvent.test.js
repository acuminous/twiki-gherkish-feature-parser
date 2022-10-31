import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { TextEvent } = Events;

describe('TextEvent', () => {

  it('should test text', () => {
    const event = new TextEvent();

    eq(event.test({ line: 'Some text' }), true);
    eq(event.test({ line: ' Some text ' }), true);
  });

  it('should interpret text', () => {
    const event = new TextEvent();

    deq(event.interpret({ line: 'Some text' }), { text: 'Some text' });
    deq(event.interpret({ line: ' Some text ' }), { text: ' Some text ' });
  });

});
