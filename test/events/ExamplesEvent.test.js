import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Languages } from '../../lib/index.js';
import StubState from '../stubs/StubState.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { ExamplesEvent } = Events;

describe('ExamplesEvent', () => {

  it('should recognise examples', () => {
    const session = { language: Languages.English };
    const state = new StubState();
    const event = new ExamplesEvent();

    eq(event.handle({ line: 'Examples:' }, session, state), true);
    eq(event.handle({ line: '  Examples  :  ' }, session, state), true);
    eq(event.handle({ line: 'Examples  :' }, session, state), true);

    eq(event.handle({ line: 'Examples' }, session, state), false);
  });

  it('should recognise localised examples', () => {
    const session = { language: Languages.Pirate };
    const state = new StubState();
    const event = new ExamplesEvent();

    eq(event.handle({ line: 'Wherest:' }, session, state), true);
    eq(event.handle({ line: '  Wherest  :  ' }, session, state), true);
    eq(event.handle({ line: 'Wherest  :' }, session, state), true);

    eq(event.handle({ line: 'Wherest' }, session, state), false);
  });

  it('should handle examples', () => {
    const session = { language: Languages.English };
    const state = new StubState((event) => {
      eq(event.name, 'ExamplesEvent');
      eq(event.source.line, 'Where:');
      eq(event.source.number, 1);
    });
    const event = new ExamplesEvent();

    event.handle({ line: 'Where:', number: 1 }, session, state);

    eq(state.count, 1);
  });
});
