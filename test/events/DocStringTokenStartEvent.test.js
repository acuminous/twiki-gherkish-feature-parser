import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Languages } from '../../lib/index.js';
import StubState from '../stubs/StubState.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { DocStringTokenStartEvent } = Events;

describe('DocStringTokenStartEvent', () => {
  let session;

  beforeEach(() => {
    session = { language: Languages.None };
  });

  it('should recognise token DocStrings', () => {
    const state = new StubState();
    const event = new DocStringTokenStartEvent();
    eq(event.handle({ line: '---' }, session, state), true);
    delete session.docString;
    eq(event.handle({ line: ' --- ' }, session, state), true);
    delete session.docString;
    eq(event.handle({ line: ' ------ ' }, session, state), true);
    delete session.docString;
    eq(event.handle({ line: '"""' }, session, state), true);
    delete session.docString;
    eq(event.handle({ line: ' """ ' }, session, state), true);
    delete session.docString;
    eq(event.handle({ line: ' """""" ' }, session, state), true);
    delete session.docString;

    eq(event.handle({ line: '-' }, session, state), false);
    delete session.docString;
    eq(event.handle({ line: '--' }, session, state), false);
    delete session.docString;
    eq(event.handle({ line: '--- not a doc string' }, session, state), false);
    delete session.docString;
    eq(event.handle({ line: '"' }, session, state), false);
    delete session.docString;
    eq(event.handle({ line: '""' }, session, state), false);
    delete session.docString;
    eq(event.handle({ line: '""" not a doc string' }, session, state), false);
    delete session.docString;
  });

  it('should not recognise token DocStrings when already handling a DocString', () => {
    const state = new StubState();
    const event = new DocStringTokenStartEvent();

    session.docString = {};
    eq(event.handle({ line: '---' }, session, state), false);
    eq(event.handle({ line: '"""' }, session, state), false);
  });

  it('should handle --- DocStrings', () => {
    const state = new StubState((event) => {
      eq(event.name, 'DocStringTokenStartEvent');
      eq(event.source.line, '   ---   ');
      eq(event.source.number, 1);
      eq(event.source.indentation, 3);
    });
    const event = new DocStringTokenStartEvent();

    event.handle({ line: '   ---   ', indentation: 3, number: 1 }, session, state);

    eq(session.docString.token, '---');
    eq(state.count, 1);
  });

  it('should handle """ DocStrings', () => {
    const state = new StubState((event) => {
      eq(event.name, 'DocStringTokenStartEvent');
      eq(event.source.line, '   """   ');
      eq(event.source.number, 1);
      eq(event.source.indentation, 3);
    });
    const event = new DocStringTokenStartEvent();

    event.handle({ line: '   """   ', indentation: 3, number: 1 }, session, state);

    eq(session.docString.token, '"""');
    eq(state.count, 1);
  });
});
