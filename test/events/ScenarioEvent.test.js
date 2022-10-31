import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Languages, Session } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { ScenarioEvent } = Events;

describe('ScenarioEvent', () => {

  it('should test scenarios', () => {
    const session = new Session();
    const event = new ScenarioEvent();

    eq(event.test({ line: 'scenario: Some scenario' }, session), true);
    eq(event.test({ line: 'Scenario: Some scenario' }, session), true);
    eq(event.test({ line: '  Scenario  : Some scenario  ' }, session), true);
    eq(event.test({ line: 'Scenario  :' }, session), true);

    eq(event.test({ line: 'Scenario' }, session), false);
  });

  it('should test localised scenarios', () => {
    const session = new Session({ language: Languages.Pirate });
    const event = new ScenarioEvent();

    eq(event.test({ line: 'sortie: Some scenario' }, session), true);
    eq(event.test({ line: 'Sortie: Some scenario' }, session), true);
    eq(event.test({ line: '  Sortie  : Some scenario  ' }, session), true);
    eq(event.test({ line: 'Sortie  :' }, session), true);

    eq(event.test({ line: 'Scenario' }, session), false);
  });

  it('should test scenarios', () => {
    const session = new Session();
    const event = new ScenarioEvent();

    deq(event.interpret({ line: 'scenario: Some scenario' }, session), { title: 'Some scenario' });
    deq(event.interpret({ line: 'Scenario: Some scenario' }, session), { title: 'Some scenario' });
    deq(event.interpret({ line: '  Scenario  : Some scenario  ' }, session), { title: 'Some scenario' });
    deq(event.interpret({ line: 'Scenario  :' }, session), { title: '' });
  });

  it('should interpret localised scenarios', () => {
    const session = new Session({ language: Languages.Pirate });
    const event = new ScenarioEvent();

    deq(event.interpret({ line: 'sortie: Some scenario' }, session), { title: 'Some scenario' });
    deq(event.interpret({ line: 'Sortie: Some scenario' }, session), { title: 'Some scenario' });
    deq(event.interpret({ line: '  Sortie  : Some scenario  ' }, session), { title: 'Some scenario' });
    deq(event.interpret({ line: 'Sortie  :' }, session), { title: '' });
  });
});
