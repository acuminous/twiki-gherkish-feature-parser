import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Languages } from '../../lib/index.js';
import StubState from '../stubs/StubState.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { EndEvent } = Events;

describe('EndEvent', () => {
  let session;

  beforeEach(() => {
    session = { language: Languages.English };
  });

  it('should recognise end of feature', () => {
    const state = new StubState();
    const event = new EndEvent();

    eq(event.interpret({ line: '\u0000' }, session, state), true);

    eq(event.interpret({ line: ' \u0000' }, session, state), false);
    eq(event.interpret({ line: '\u0000 ' }, session, state), false);
  });

  it('should handle end of feature', () => {
    const state = new StubState((event, context) => {
      eq(event.name, 'EndEvent');
      eq(context.source.line, '\u0000');
      eq(context.source.number, 1);
      deq(context.data, {});
    });
    const event = new EndEvent();

    event.interpret({ line: '\u0000', number: 1 }, session, state);

    eq(state.count, 1);
  });
});
