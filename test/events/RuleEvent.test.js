import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Languages, Session } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { RuleEvent } = Events;

describe('RuleEvent', () => {

  it('should test rules', () => {
    const session = new Session();
    const event = new RuleEvent();

    eq(event.test({ line: 'rule: Some rule' }, session), true);
    eq(event.test({ line: 'Rule: Some rule' }, session), true);
    eq(event.test({ line: '  Rule  : Some rule  ' }, session), true);
    eq(event.test({ line: 'Rule  :' }, session), true);

    eq(event.test({ line: 'Rule' }, session), false);
  });

  it('should test localised rules', () => {
    const session = new Session({ language: Languages.Pirate });
    const event = new RuleEvent();

    eq(event.test({ line: 'guideline: Some rule' }, session), true);
    eq(event.test({ line: 'Guideline: Some rule' }, session), true);
    eq(event.test({ line: '  Guideline  : Some rule  ' }, session), true);
    eq(event.test({ line: 'Guideline  :' }, session), true);

    eq(event.test({ line: 'Guideline' }, session), false);
  });

  it('should interpret rules', () => {
    const session = new Session();
    const event = new RuleEvent();

    deq(event.interpret({ line: 'rule: Some rule' }, session), { title: 'Some rule' });
    deq(event.interpret({ line: 'Rule: Some rule' }, session), { title: 'Some rule' });
    deq(event.interpret({ line: '  Rule  : Some rule  ' }, session), { title: 'Some rule' });
    deq(event.interpret({ line: 'Rule  :' }, session), { title: '' });
  });

  it('should interpret localised rules', () => {
    const session = new Session({ language: Languages.Pirate });
    const event = new RuleEvent();

    deq(event.interpret({ line: 'guideline: Some rule' }, session), { title: 'Some rule' });
    deq(event.interpret({ line: 'Guideline: Some rule' }, session), { title: 'Some rule' });
    deq(event.interpret({ line: '  Guideline  : Some rule  ' }, session), { title: 'Some rule' });
    deq(event.interpret({ line: 'Guideline  :' }, session), { title: '' });
  });
});
