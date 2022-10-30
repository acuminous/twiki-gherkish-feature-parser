import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Languages } from '../../lib/index.js';
import StubState from '../stubs/StubState.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { ExplicitDocStringStopEvent } = Events;

describe('ExplicitDocStringStopEvent', () => {
  let session;

  beforeEach(() => {
    session = { language: Languages.English };
  });

  it('should handle --- docstrings', () => {
    const state = new StubState((event) => {
      eq(event.name, 'ExplicitDocStringStopEvent');
      eq(event.source.line, '   ---   ');
      eq(event.source.number, 1);
    });
    const event = new ExplicitDocStringStopEvent();

    session.docstring = { token: '---', indentation: 6 };
    event.interpret({ line: '   ---   ', number: 1 }, session, state);

    eq(state.count, 1);
    eq(session.docstring, undefined);
  });

  it('should handle """ docstrings', () => {
    const state = new StubState((event) => {
      eq(event.name, 'ExplicitDocStringStopEvent');
      eq(event.source.line, '   """   ');
      eq(event.source.number, 1);
    });
    const event = new ExplicitDocStringStopEvent();

    session.docstring = { token: '"""', indentation: 6 };
    event.interpret({ line: '   """   ', number: 1 }, session, state);

    eq(state.count, 1);
    eq(session.docstring, undefined);
  });

  it('should do nothing when already handling an indented docstring', () => {
    const state = new StubState();
    const event = new ExplicitDocStringStopEvent();

    session.docstring = {};
    eq(event.interpret({ line: '   """   ' }, session, state), false);
  });

  it('should do nothing when not handling an explicit docstring', () => {
    const state = new StubState();
    const event = new ExplicitDocStringStopEvent();

    eq(event.interpret({ line: '   """   ' }, session, state), false);
  });
});
