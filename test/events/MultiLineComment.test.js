import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Languages } from '../../lib/index.js';
import StubState from '../stubs/StubState.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { MultiLineCommentEvent } = Events;

describe('MultiLineCommentEvent', () => {
  let session;

  beforeEach(() => {
    session = { language: Languages.utils.getDefault() };
  });

  it('should recognise multi line comments', () => {
    const state = new StubState();
    const event = new MultiLineCommentEvent();

    eq(event.handle({ line: '### Some comment' }, session, state), true);
    eq(event.handle({ line: ' ### Some comment' }, session, state), true);
    eq(event.handle({ line: '###' }, session, state), true);
    eq(event.handle({ line: '#### Some comment' }, session, state), true);

    eq(event.handle({ line: '## No commment' }, session, state), false);
  });

  it('should handle multi line comments', () => {
    const state = new StubState((event) => {
      eq(event.name, 'MultiLineCommentEvent');
      eq(event.source.line, '### Some comment ');
      eq(event.source.number, 1);
      eq(event.data.text, 'Some comment');
    });
    const event = new MultiLineCommentEvent();

    event.handle({ line: '### Some comment ', number: 1 }, session, state);

    eq(state.count, 1);
  });
});
