import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Languages } from '../../lib/index.js';
import StubState from '../stubs/StubState.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { DocStringTokenStopEvent } = Events;

describe('DocStringTokenStopEvent', () => {
  let session;

  beforeEach(() => {
    session = { language: Languages.English };
  });

  it('should handle --- docstrings', () => {
    const state = new StubState((event) => {
      eq(event.name, 'DocStringTokenStopEvent');
      eq(event.source.line, '   ---   ');
      eq(event.source.number, 1);
    });
    const event = new DocStringTokenStopEvent();

    session.docString = { token: '---', indentation: 6 };
    event.handle({ line: '   ---   ', number: 1 }, session, state);

    eq(state.count, 1);
    eq(session.docString, undefined);
  });

  it('should handle """ docstrings', () => {
    const state = new StubState((event) => {
      eq(event.name, 'DocStringTokenStopEvent');
      eq(event.source.line, '   """   ');
      eq(event.source.number, 1);
    });
    const event = new DocStringTokenStopEvent();

    session.docString = { token: '"""', indentation: 6 };
    event.handle({ line: '   """   ', number: 1 }, session, state);

    eq(state.count, 1);
    eq(session.docString, undefined);
  });

  it('should do nothing when already handling an indented docstring', () => {
    const state = new StubState();
    const event = new DocStringTokenStopEvent();

    session.docString = {};
    eq(event.handle({ line: '   """   ' }, session, state), false);
  });

  it('should do nothing when not handling a token docstring', () => {
    const state = new StubState();
    const event = new DocStringTokenStopEvent();

    eq(event.handle({ line: '   """   ' }, session, state), false);
  });
});
