import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Languages } from '../../lib/index.js';
import StubState from '../stubs/StubState.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { DocStringIndentStartEvent } = Events;

describe('DocStringIndentStartEvent', () => {
  let session;

  beforeEach(() => {
    session = {
      language: Languages.None,
      indentation: 0,
    };
  });

  it('should recognise indented DocStrings', () => {
    const state = new StubState();
    const event = new DocStringIndentStartEvent();

    eq(event.handle({ line: ' some text', indentation: 1 }, session, state), true);
  });

  it('should not recognise text that is not indented', () => {
    const state = new StubState();
    const event = new DocStringIndentStartEvent();

    eq(event.handle({ line: 'some text', indentation: 0 }, session, state), false);
  });

  it('should not recognise indented DocStrings when already handling a DocString', () => {
    const state = new StubState();
    const event = new DocStringIndentStartEvent();

    session.docString = {};
    eq(event.handle({ line: ' some text', indentation: 1 }, session, state), false);
  });

  it('should handle indented DocStrings', () => {
    const state = new StubState((event) => {
      eq(event.name, 'DocStringIndentStartEvent');
      eq(event.source.line, '   some text   ');
      eq(event.source.number, 1);
      eq(event.source.indentation, 3);
    });
    const event = new DocStringIndentStartEvent();

    event.handle({ line: '   some text   ', indentation: 3, number: 1 }, session, state);

    eq(session.docString.indentation, 3);
    eq(state.count, 1);
  });
});
