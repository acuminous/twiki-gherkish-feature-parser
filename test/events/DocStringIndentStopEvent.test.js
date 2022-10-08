import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Languages } from '../../lib/index.js';
import StubState from '../stubs/StubState.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { DocStringIndentStopEvent } = Events;

describe('DocStringIndentStopEvent', () => {
  let session;

  beforeEach(() => {
    session = { language: Languages.English };
  });

  it('should handle indented docstrings', () => {
    const state = new StubState((event) => {
      eq(event.name, 'DocStringIndentStopEvent');
      eq(event.source.line, '   some text   ');
      eq(event.source.number, 1);
      eq(event.source.indentation, 3);
    });
    const event = new DocStringIndentStopEvent();

    session.docstring = { indentation: 6 };
    event.handle({ line: '   some text   ', indentation: 3, number: 1 }, session, state);

    eq(session.docstring, undefined);
    eq(state.count, 1);
  });

  it('should do nothing when still indented', () => {
    const state = new StubState();
    const event = new DocStringIndentStopEvent();

    session.docstring = { indentation: 6 };
    eq(event.handle({ line: '   some text   ', indentation: 6 }, session, state), false);
  });

  it('should do nothing when not handling an indented docstring', () => {
    const state = new StubState();
    const event = new DocStringIndentStopEvent();

    eq(event.handle({ line: '   some text   ', indentation: 3 }, session, state), false);
  });

  it('should do nothing when already handling an explicit docstring', () => {
    const state = new StubState();
    const event = new DocStringIndentStopEvent();

    session.docstring = { token: {} };
    eq(event.handle({ line: '   some text   ', indentation: 3 }, session, state), false);
  });
});
