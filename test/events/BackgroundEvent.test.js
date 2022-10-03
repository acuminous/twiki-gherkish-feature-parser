import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Languages } from '../../lib/index.js';
import StubState from '../stubs/StubState.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { BackgroundEvent } = Events;

describe('BackgroundEvent', () => {

  it('should recognise backgrounds', () => {
    const session = { language: Languages.English };
    const state = new StubState();
    const event = new BackgroundEvent();

    eq(event.handle({ line: 'background: Some background' }, session, state), true);
    eq(event.handle({ line: 'Background: Some background' }, session, state), true);
    eq(event.handle({ line: '  Background  : Some background  ' }, session, state), true);
    eq(event.handle({ line: 'Background  :' }, session, state), true);

    eq(event.handle({ line: 'Background' }, session, state), false);
  });

  it('should recognise localised backgrounds', () => {
    const session = { language: Languages.Pirate };
    const state = new StubState();
    const event = new BackgroundEvent();

    eq(event.handle({ line: 'Lore: Some background' }, session, state), true);
    eq(event.handle({ line: 'Lore: Some background' }, session, state), true);
    eq(event.handle({ line: '  Lore  : Some background  ' }, session, state), true);
    eq(event.handle({ line: 'Lore  :' }, session, state), true);

    eq(event.handle({ line: 'Lore' }, session, state), false);
  });

  it('should handle backgrounds', () => {
    const session = { language: Languages.English };
    const state = new StubState((event) => {
      eq(event.name, 'BackgroundEvent');
      eq(event.source.line, 'Background:  Some background ');
      eq(event.source.number, 1);
      eq(event.data.title, 'Some background');
    });
    const event = new BackgroundEvent();

    event.handle({ line: 'Background:  Some background ', number: 1 }, session, state);

    eq(state.count, 1);
  });
});
