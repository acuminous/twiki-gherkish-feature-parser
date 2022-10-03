import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Languages } from '../../lib/index.js';
import StubState from '../stubs/StubState.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { FeatureEvent } = Events;

describe('FeatureEvent', () => {

  it('should recognise features', () => {
    const session = { language: Languages.None };
    const state = new StubState();
    const event = new FeatureEvent();

    eq(event.handle({ line: 'feature: Some feature' }, session, state), true);
    eq(event.handle({ line: 'Feature: Some feature' }, session, state), true);
    eq(event.handle({ line: '  Feature  : Some feature  ' }, session, state), true);
    eq(event.handle({ line: 'Feature  :' }, session, state), true);

    eq(event.handle({ line: 'Feature' }, session, state), false);
  });

  it('should recognise localised features', () => {
    const session = { language: Languages.Pirate };
    const state = new StubState();
    const event = new FeatureEvent();

    eq(event.handle({ line: 'yarn: Some feature' }, session, state), true);
    eq(event.handle({ line: 'Yarn: Some feature' }, session, state), true);
    eq(event.handle({ line: '  Yarn  : Some feature  ' }, session, state), true);
    eq(event.handle({ line: 'Yarn  :' }, session, state), true);

    eq(event.handle({ line: 'Yarn' }, session, state), false);
  });

  it('should handle features', () => {
    const session = { language: Languages.None };
    const state = new StubState((event) => {
      eq(event.name, 'FeatureEvent');
      eq(event.source.line, 'Feature:  Some feature ');
      eq(event.source.number, 1);
      eq(event.data.title, 'Some feature');
    });
    const event = new FeatureEvent();

    event.handle({ line: 'Feature:  Some feature ', number: 1 }, session, state);

    eq(state.count, 1);
  });
});
