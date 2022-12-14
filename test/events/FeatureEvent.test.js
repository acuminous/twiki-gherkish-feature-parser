import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Languages, Session, Source } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { FeatureEvent } = Events;

describe('FeatureEvent', () => {

  it('should test features', () => {
    const session = new Session();
    const event = new FeatureEvent();

    eq(event.test(new Source({ line: 'feature: Some feature' }), session), true);
    eq(event.test(new Source({ line: 'Feature: Some feature' }), session), true);
    eq(event.test(new Source({ line: '  Feature  : Some feature  ' }), session), true);
    eq(event.test(new Source({ line: 'Feature  :' }), session), true);

    eq(event.test(new Source({ line: 'Feature' }), session), false);
  });

  it('should test localised features', () => {
    const session = new Session({ language: Languages.Pirate });
    const event = new FeatureEvent();

    eq(event.test(new Source({ line: 'yarn: Some feature' }), session), true);
    eq(event.test(new Source({ line: 'Yarn: Some feature' }), session), true);
    eq(event.test(new Source({ line: '  Yarn  : Some feature  ' }), session), true);
    eq(event.test(new Source({ line: 'Yarn  :' }), session), true);

    eq(event.test(new Source({ line: 'Yarn' }), session), false);
  });

  it('should interpret features', () => {
    const session = new Session();
    const event = new FeatureEvent();

    deq(event.interpret(new Source({ line: 'feature: Some feature' }), session), { title: 'Some feature' });
    deq(event.interpret(new Source({ line: 'Feature: Some feature' }), session), { title: 'Some feature' });
    deq(event.interpret(new Source({ line: '  Feature  : Some feature  ' }), session), { title: 'Some feature' });
    deq(event.interpret(new Source({ line: 'Feature  :' }), session), { title: '' });
  });

  it('should interpret localised features', () => {
    const session = new Session({ language: Languages.Pirate });
    const event = new FeatureEvent();

    deq(event.interpret(new Source({ line: 'yarn: Some feature' }), session), { title: 'Some feature' });
    deq(event.interpret(new Source({ line: 'Yarn: Some feature' }), session), { title: 'Some feature' });
    deq(event.interpret(new Source({ line: '  Yarn  : Some feature  ' }), session), { title: 'Some feature' });
    deq(event.interpret(new Source({ line: 'Yarn  :' }), session), { title: '' });
  });
});
