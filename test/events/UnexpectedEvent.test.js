import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Languages } from '../../lib/index.js';
import StubState from '../stubs/StubState.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { MissingEventHandlerEvent } = Events;

describe('MissingEventHandlerEvent', () => {
  let session;

  beforeEach(() => {
    session = { language: Languages.English };
  });

  it('should recognise anything', () => {
    const state = new StubState();
    const event = new MissingEventHandlerEvent();

    eq(event.interpret({ line: 'anything' }, session, state), true);
  });

  it('should handle anything', () => {
    const state = new StubState((event) => {
      eq(event.name, 'MissingEventHandlerEvent');
      eq(event.source.line, 'anything');
      eq(event.source.number, 1);
      deq(event.data, {});
    });
    const event = new MissingEventHandlerEvent();

    event.interpret({ line: 'anything', number: 1 }, session, state);

    eq(state.count, 1);
  });
});
