import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Languages } from '../../lib/index.js';
import StubState from '../stubs/StubState.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { LanguageEvent } = Events;

describe('LanguageEvent', () => {
  let session;

  beforeEach(() => {
    session = { language: Languages.utils.getDefault() };
  });

  it('should recognise languages', () => {
    const state = new StubState();
    const event = new LanguageEvent();

    eq(event.handle({ line: '#Language:Pirate' }, session, state), true);
    eq(event.handle({ line: '#Language : Pirate' }, session, state), true);
    eq(event.handle({ line: '# Language : Pirate ' }, session, state), true);
    eq(event.handle({ line: '#language:Pirate' }, session, state), true);

    eq(event.handle({ line: 'Language' }, session, state), false);
  });

  it('should handle languages', () => {
    const state = new StubState((event) => {
      eq(event.name, 'LanguageEvent');
      eq(event.source.line, '#Language : Pirate ');
      eq(event.source.number, 1);
      eq(event.data.name, 'Pirate');
    });
    const event = new LanguageEvent();

    event.handle({ line: '#Language : Pirate ', number: 1 }, session, state);

    eq(state.count, 1);
  });
});
