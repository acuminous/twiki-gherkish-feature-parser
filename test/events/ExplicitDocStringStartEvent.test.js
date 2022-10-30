import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Languages } from '../../lib/index.js';
import StubState from '../stubs/StubState.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { ExplicitDocStringStartEvent } = Events;

describe('ExplicitDocStringStartEvent', () => {
  let session;

  beforeEach(() => {
    session = { language: Languages.English };
  });

  it('should recognise explicit docstrings', () => {
    const state = new StubState();
    const event = new ExplicitDocStringStartEvent();
    eq(event.interpret({ line: '---' }, session, state), true);
    delete session.docstring;
    eq(event.interpret({ line: ' --- ' }, session, state), true);
    delete session.docstring;
    eq(event.interpret({ line: ' ------ ' }, session, state), true);
    delete session.docstring;
    eq(event.interpret({ line: '"""' }, session, state), true);
    delete session.docstring;
    eq(event.interpret({ line: ' """ ' }, session, state), true);
    delete session.docstring;
    eq(event.interpret({ line: ' """""" ' }, session, state), true);
    delete session.docstring;

    eq(event.interpret({ line: '-' }, session, state), false);
    delete session.docstring;
    eq(event.interpret({ line: '--' }, session, state), false);
    delete session.docstring;
    eq(event.interpret({ line: '--- not a doc string' }, session, state), false);
    delete session.docstring;
    eq(event.interpret({ line: '"' }, session, state), false);
    delete session.docstring;
    eq(event.interpret({ line: '""' }, session, state), false);
    delete session.docstring;
    eq(event.interpret({ line: '""" not a doc string' }, session, state), false);
    delete session.docstring;
  });

  it('should not recognise token docstrings when already handling a docstring', () => {
    const state = new StubState();
    const event = new ExplicitDocStringStartEvent();

    session.docstring = {};
    eq(event.interpret({ line: '---' }, session, state), false);
    eq(event.interpret({ line: '"""' }, session, state), false);
  });

  it('should handle --- docstrings', () => {
    const state = new StubState((event, context) => {
      eq(event.name, 'ExplicitDocStringStartEvent');
      eq(context.source.line, '   ---   ');
      eq(context.source.number, 1);
      eq(context.source.indentation, 3);
    });
    const event = new ExplicitDocStringStartEvent();

    event.interpret({ line: '   ---   ', indentation: 3, number: 1 }, session, state);

    eq(session.docstring.token, '---');
    eq(state.count, 1);
  });

  it('should handle """ docstrings', () => {
    const state = new StubState((event, context) => {
      eq(event.name, 'ExplicitDocStringStartEvent');
      eq(context.source.line, '   """   ');
      eq(context.source.number, 1);
      eq(context.source.indentation, 3);
    });
    const event = new ExplicitDocStringStartEvent();

    event.interpret({ line: '   """   ', indentation: 3, number: 1 }, session, state);

    eq(session.docstring.token, '"""');
    eq(state.count, 1);
  });
});
