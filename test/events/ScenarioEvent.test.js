import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Languages } from '../../lib/index.js';
import StubState from '../stubs/StubState.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { ScenarioEvent } = Events;

describe('ScenarioEvent', () => {

  it('should recognise scenarios', () => {
    const session = { language: Languages.English };
    const state = new StubState();
    const event = new ScenarioEvent();

    eq(event.handle({ line: 'scenario: Some scenario' }, session, state), true);
    eq(event.handle({ line: 'Scenario: Some scenario' }, session, state), true);
    eq(event.handle({ line: '  Scenario  : Some scenario  ' }, session, state), true);
    eq(event.handle({ line: 'Scenario  :' }, session, state), true);

    eq(event.handle({ line: 'Scenario' }, session, state), false);
  });

  it('should recognise localised scenarios', () => {
    const session = { language: Languages.Pirate };
    const state = new StubState();
    const event = new ScenarioEvent();

    eq(event.handle({ line: 'sortie: Some scenario' }, session, state), true);
    eq(event.handle({ line: 'Sortie: Some scenario' }, session, state), true);
    eq(event.handle({ line: '  Sortie  : Some scenario  ' }, session, state), true);
    eq(event.handle({ line: 'Sortie  :' }, session, state), true);

    eq(event.handle({ line: 'Scenario' }, session, state), false);
  });

  it('should handle scenarios', () => {
    const session = { language: Languages.English };
    const state = new StubState((event) => {
      eq(event.name, 'ScenarioEvent');
      eq(event.source.line, 'Scenario:  Some scenario ');
      eq(event.source.number, 1);
      eq(event.data.title, 'Some scenario');
    });
    const event = new ScenarioEvent();

    event.handle({ line: 'Scenario:  Some scenario ', number: 1 }, session, state);

    eq(state.count, 1);
  });
});
