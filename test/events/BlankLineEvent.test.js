import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Languages } from '../../lib/index.js';
import StubState from '../stubs/StubState.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { BlankLineEvent } = Events;

describe('BlankLineEvent', () => {
  let session;

  beforeEach(() => {
    session = { language: Languages.None };
  });

  it('should recognise blank lines', () => {
    const state = new StubState();
    const event = new BlankLineEvent();

    eq(event.handle({ line: '' }, session, state), true);
    eq(event.handle({ line: '   ' }, session, state), true);

    eq(event.handle({ line: 'Not Blank' }, session, state), false);
  });

  it('should handle blank lines', () => {
    const state = new StubState((event) => {
      eq(event.name, 'BlankLineEvent');
      eq(event.source.line, '');
      eq(event.source.number, 1);
      deq(event.data, {});
    });
    const event = new BlankLineEvent();

    event.handle({ line: '', number: 1 }, session, state);

    eq(state.count, 1);
  });
});
