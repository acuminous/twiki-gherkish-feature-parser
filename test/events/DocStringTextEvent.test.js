import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Languages } from '../../lib/index.js';
import StubState from '../stubs/StubState.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { DocStringTextEvent } = Events;

describe('DocStringTextEvent', () => {
  let session;

  beforeEach(() => {
    session = {
      language: Languages.English,
      docstring: {
        indentation: 3,
      },
    };
  });

  it('should recognise docstrings', () => {
    const state = new StubState();
    const event = new DocStringTextEvent();

    eq(event.handle({ line: 'some text' }, session, state), true);
    eq(event.handle({ line: ' some text ' }, session, state), true);
  });

  it('should handle docstrings', () => {
    const state = new StubState((event) => {
      eq(event.name, 'DocStringTextEvent');
      eq(event.source.line, '   some text   ');
      eq(event.source.indentation, 3);
      eq(event.source.number, 1);
    });
    const event = new DocStringTextEvent();

    event.handle({ line: '   some text   ', indentation: 3, number: 1 }, session, state);

    eq(state.count, 1);
  });
});
