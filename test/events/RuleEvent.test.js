import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Languages, Session, Source } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { RuleEvent } = Events;

describe('RuleEvent', () => {

  it('should test rules', () => {
    const session = new Session();
    const event = new RuleEvent();

    eq(event.test(new Source({ line: 'rule: Some rule' }), session), true);
    eq(event.test(new Source({ line: 'Rule: Some rule' }), session), true);
    eq(event.test(new Source({ line: '  Rule  : Some rule  ' }), session), true);
    eq(event.test(new Source({ line: 'Rule  :' }), session), true);

    eq(event.test(new Source({ line: 'Rule' }), session), false);
  });

  it('should test localised rules', () => {
    const session = new Session({ language: Languages.Pirate });
    const event = new RuleEvent();

    eq(event.test(new Source({ line: 'guideline: Some rule' }), session), true);
    eq(event.test(new Source({ line: 'Guideline: Some rule' }), session), true);
    eq(event.test(new Source({ line: '  Guideline  : Some rule  ' }), session), true);
    eq(event.test(new Source({ line: 'Guideline  :' }), session), true);

    eq(event.test(new Source({ line: 'Guideline' }), session), false);
  });

  it('should interpret rules', () => {
    const session = new Session();
    const event = new RuleEvent();

    deq(event.interpret(new Source({ line: 'rule: Some rule' }), session), { title: 'Some rule' });
    deq(event.interpret(new Source({ line: 'Rule: Some rule' }), session), { title: 'Some rule' });
    deq(event.interpret(new Source({ line: '  Rule  : Some rule  ' }), session), { title: 'Some rule' });
    deq(event.interpret(new Source({ line: 'Rule  :' }), session), { title: '' });
  });

  it('should interpret localised rules', () => {
    const session = new Session({ language: Languages.Pirate });
    const event = new RuleEvent();

    deq(event.interpret(new Source({ line: 'guideline: Some rule' }), session), { title: 'Some rule' });
    deq(event.interpret(new Source({ line: 'Guideline: Some rule' }), session), { title: 'Some rule' });
    deq(event.interpret(new Source({ line: '  Guideline  : Some rule  ' }), session), { title: 'Some rule' });
    deq(event.interpret(new Source({ line: 'Guideline  :' }), session), { title: '' });
  });
});
