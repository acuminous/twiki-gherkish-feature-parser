import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Languages, Session } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { FeatureEvent } = Events;

describe('FeatureEvent', () => {

  it('should test features', () => {
    const session = new Session();
    const event = new FeatureEvent();

    eq(event.test({ line: 'feature: Some feature' }, session), true);
    eq(event.test({ line: 'Feature: Some feature' }, session), true);
    eq(event.test({ line: '  Feature  : Some feature  ' }, session), true);
    eq(event.test({ line: 'Feature  :' }, session), true);

    eq(event.test({ line: 'Feature' }, session), false);
  });

  it('should test localised features', () => {
    const session = new Session({ language: Languages.Pirate });
    const event = new FeatureEvent();

    eq(event.test({ line: 'yarn: Some feature' }, session), true);
    eq(event.test({ line: 'Yarn: Some feature' }, session), true);
    eq(event.test({ line: '  Yarn  : Some feature  ' }, session), true);
    eq(event.test({ line: 'Yarn  :' }, session), true);

    eq(event.test({ line: 'Yarn' }, session), false);
  });

  it('should interpret features', () => {
    const session = new Session();
    const event = new FeatureEvent();

    deq(event.interpret({ line: 'feature: Some feature' }, session), { title: 'Some feature' });
    deq(event.interpret({ line: 'Feature: Some feature' }, session), { title: 'Some feature' });
    deq(event.interpret({ line: '  Feature  : Some feature  ' }, session), { title: 'Some feature' });
    deq(event.interpret({ line: 'Feature  :' }, session), { title: '' });
  });

  it('should interpret localised features', () => {
    const session = new Session({ language: Languages.Pirate });
    const event = new FeatureEvent();

    deq(event.interpret({ line: 'yarn: Some feature' }, session), { title: 'Some feature' });
    deq(event.interpret({ line: 'Yarn: Some feature' }, session), { title: 'Some feature' });
    deq(event.interpret({ line: '  Yarn  : Some feature  ' }, session), { title: 'Some feature' });
    deq(event.interpret({ line: 'Yarn  :' }, session), { title: '' });
  });
});
