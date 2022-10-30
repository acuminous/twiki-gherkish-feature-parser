import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Languages } from '../../lib/index.js';
import StubState from '../stubs/StubState.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { BlankLineEvent } = Events;

describe('BlankLineEvent', () => {
  let session;

  beforeEach(() => {
    session = { language: Languages.English };
  });

  it('should recognise blank lines', () => {
    const state = new StubState();
    const event = new BlankLineEvent();

    eq(event.interpret({ line: '' }, session, state), true);
    eq(event.interpret({ line: '   ' }, session, state), true);

    eq(event.interpret({ line: 'Not Blank' }, session, state), false);
  });

  it('should handle blank lines', () => {
    const state = new StubState((event, context) => {
      eq(event.name, 'BlankLineEvent');
      eq(context.source.line, '');
      eq(context.source.number, 1);
      deq(context.data, {});
    });
    const event = new BlankLineEvent();

    event.interpret({ line: '', number: 1 }, session, state);

    eq(state.count, 1);
  });
});
