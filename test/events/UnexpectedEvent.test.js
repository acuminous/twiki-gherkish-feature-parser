import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Languages } from '../../lib/index.js';
import StubState from '../stubs/StubState.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { UnexpectedEvent } = Events;

describe('UnexpectedEvent', () => {
  let session;

  beforeEach(() => {
    session = { language: Languages.English };
  });

  it('should recognise anything', () => {
    const state = new StubState();
    const event = new UnexpectedEvent();

    eq(event.handle({ line: 'anything' }, session, state), true);
  });

  it('should handle anything', () => {
    const state = new StubState((event) => {
      eq(event.name, 'UnexpectedEvent');
      eq(event.source.line, 'anything');
      eq(event.source.number, 1);
      deq(event.data, {});
    });
    const event = new UnexpectedEvent();

    event.handle({ line: 'anything', number: 1 }, session, state);

    eq(state.count, 1);
  });
});
