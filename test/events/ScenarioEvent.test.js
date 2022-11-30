import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Languages, Session, Source } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { ScenarioEvent } = Events;

describe('ScenarioEvent', () => {

  it('should test scenarios', () => {
    const session = new Session();
    const event = new ScenarioEvent();

    eq(event.test(new Source({ line: 'scenario: Some scenario' }), session), true);
    eq(event.test(new Source({ line: 'Scenario: Some scenario' }), session), true);
    eq(event.test(new Source({ line: '  Scenario  : Some scenario  ' }), session), true);
    eq(event.test(new Source({ line: 'Scenario  :' }), session), true);

    eq(event.test(new Source({ line: 'Scenario' }), session), false);
  });

  it('should test localised scenarios', () => {
    const session = new Session({ language: Languages.Pirate });
    const event = new ScenarioEvent();

    eq(event.test(new Source({ line: 'sortie: Some scenario' }), session), true);
    eq(event.test(new Source({ line: 'Sortie: Some scenario' }), session), true);
    eq(event.test(new Source({ line: '  Sortie  : Some scenario  ' }), session), true);
    eq(event.test(new Source({ line: 'Sortie  :' }), session), true);

    eq(event.test(new Source({ line: 'Scenario' }), session), false);
  });

  it('should test scenarios', () => {
    const session = new Session();
    const event = new ScenarioEvent();

    deq(event.interpret(new Source({ line: 'scenario: Some scenario' }), session), { title: 'Some scenario' });
    deq(event.interpret(new Source({ line: 'Scenario: Some scenario' }), session), { title: 'Some scenario' });
    deq(event.interpret(new Source({ line: '  Scenario  : Some scenario  ' }), session), { title: 'Some scenario' });
    deq(event.interpret(new Source({ line: 'Scenario  :' }), session), { title: '' });
  });

  it('should interpret localised scenarios', () => {
    const session = new Session({ language: Languages.Pirate });
    const event = new ScenarioEvent();

    deq(event.interpret(new Source({ line: 'sortie: Some scenario' }), session), { title: 'Some scenario' });
    deq(event.interpret(new Source({ line: 'Sortie: Some scenario' }), session), { title: 'Some scenario' });
    deq(event.interpret(new Source({ line: '  Sortie  : Some scenario  ' }), session), { title: 'Some scenario' });
    deq(event.interpret(new Source({ line: 'Sortie  :' }), session), { title: '' });
  });
});
