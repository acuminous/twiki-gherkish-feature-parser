import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { BlockCommentEvent } = Events;

describe('BlockCommentEvent', () => {

  it('should test block comments', () => {
    const event = new BlockCommentEvent();

    eq(event.test({ line: '### Some comment' }), true);
    eq(event.test({ line: ' ### Some comment' }), true);
    eq(event.test({ line: '###' }), true);
    eq(event.test({ line: '#### Some comment' }), true);

    eq(event.test({ line: '## No commment' }), false);
  });

  it('should recognise block comments', () => {
    const event = new BlockCommentEvent();

    deq(event.interpret({ line: '### Some comment' }), {});
    deq(event.interpret({ line: ' ### Some comment' }), {});
    deq(event.interpret({ line: '###' }), {});
    deq(event.interpret({ line: '#### Some comment' }), {});
  });
});
