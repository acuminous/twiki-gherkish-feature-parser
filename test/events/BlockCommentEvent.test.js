import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Languages } from '../../lib/index.js';
import StubState from '../stubs/StubState.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { BlockCommentEvent } = Events;

describe('BlockCommentEvent', () => {
  let session;

  beforeEach(() => {
    session = { language: Languages.English };
  });

  it('should recognise block comments', () => {
    const state = new StubState();
    const event = new BlockCommentEvent();

    eq(event.interpret({ line: '### Some comment' }, session, state), true);
    eq(event.interpret({ line: ' ### Some comment' }, session, state), true);
    eq(event.interpret({ line: '###' }, session, state), true);
    eq(event.interpret({ line: '#### Some comment' }, session, state), true);

    eq(event.interpret({ line: '## No commment' }, session, state), false);
  });

  it('should handle block comments', () => {
    const state = new StubState((event) => {
      eq(event.name, 'BlockCommentEvent');
      eq(event.source.line, '### Some comment ');
      eq(event.source.number, 1);
      eq(event.data.text, 'Some comment');
    });
    const event = new BlockCommentEvent();

    event.interpret({ line: '### Some comment ', number: 1 }, session, state);

    eq(state.count, 1);
  });
});
