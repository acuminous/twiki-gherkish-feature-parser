import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Languages } from '../../lib/index.js';
import StubState from '../stubs/StubState.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { DocStringEvent } = Events;

describe('DocStringEvent', () => {
  let session;

  beforeEach(() => {
    session = {
      language: Languages.English,
      docString: {
        indentation: 3,
      },
    };
  });

  it('should recognise DocStrings', () => {
    const state = new StubState();
    const event = new DocStringEvent();

    eq(event.handle({ line: 'Some text' }, session, state), true);
    eq(event.handle({ line: ' some text ' }, session, state), true);
  });

  it('should handle DocStrings', () => {
    const state = new StubState((event) => {
      eq(event.name, 'DocStringEvent');
      eq(event.source.line, '   Some text   ');
      eq(event.source.indentation, 3);
      eq(event.source.number, 1);
    });
    const event = new DocStringEvent();

    event.handle({ line: '   Some text   ', indentation: 3, number: 1 }, session, state);

    eq(state.count, 1);
  });
});
