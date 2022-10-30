import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Languages } from '../../lib/index.js';
import StubState from '../stubs/StubState.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { ImplicitDocStringStartEvent } = Events;

describe('ImplicitDocStringStartEvent', () => {
  let session;

  beforeEach(() => {
    session = {
      language: Languages.English,
      indentation: 0,
    };
  });

  it('should recognise indented docstrings', () => {
    const state = new StubState();
    const event = new ImplicitDocStringStartEvent();

    eq(event.interpret({ line: ' some text', indentation: 1 }, session, state), true);
  });

  it('should not recognise text that is not indented', () => {
    const state = new StubState();
    const event = new ImplicitDocStringStartEvent();

    eq(event.interpret({ line: 'some text', indentation: 0 }, session, state), false);
  });

  it('should not recognise indented docstrings when already handling a docstring', () => {
    const state = new StubState();
    const event = new ImplicitDocStringStartEvent();

    session.docstring = {};
    eq(event.interpret({ line: ' some text', indentation: 1 }, session, state), false);
  });

  it('should handle indented docstrings', () => {
    const state = new StubState((event) => {
      eq(event.name, 'ImplicitDocStringStartEvent');
      eq(event.source.line, '   some text   ');
      eq(event.source.number, 1);
      eq(event.source.indentation, 3);
    });
    const event = new ImplicitDocStringStartEvent();

    event.interpret({ line: '   some text   ', indentation: 3, number: 1 }, session, state);

    eq(session.docstring.indentation, 3);
    eq(state.count, 1);
  });
});
