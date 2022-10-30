import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Languages } from '../../lib/index.js';
import StubState from '../stubs/StubState.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { FeatureEvent } = Events;

describe('FeatureEvent', () => {

  it('should recognise features', () => {
    const session = { language: Languages.English };
    const state = new StubState();
    const event = new FeatureEvent();

    eq(event.interpret({ line: 'feature: Some feature' }, session, state), true);
    eq(event.interpret({ line: 'Feature: Some feature' }, session, state), true);
    eq(event.interpret({ line: '  Feature  : Some feature  ' }, session, state), true);
    eq(event.interpret({ line: 'Feature  :' }, session, state), true);

    eq(event.interpret({ line: 'Feature' }, session, state), false);
  });

  it('should recognise localised features', () => {
    const session = { language: Languages.Pirate };
    const state = new StubState();
    const event = new FeatureEvent();

    eq(event.interpret({ line: 'yarn: Some feature' }, session, state), true);
    eq(event.interpret({ line: 'Yarn: Some feature' }, session, state), true);
    eq(event.interpret({ line: '  Yarn  : Some feature  ' }, session, state), true);
    eq(event.interpret({ line: 'Yarn  :' }, session, state), true);

    eq(event.interpret({ line: 'Yarn' }, session, state), false);
  });

  it('should handle features', () => {
    const session = { language: Languages.English };
    const state = new StubState((event, context) => {
      eq(event.name, 'FeatureEvent');
      eq(context.source.line, 'Feature:  Some feature ');
      eq(context.source.number, 1);
      eq(context.data.title, 'Some feature');
    });
    const event = new FeatureEvent();

    event.interpret({ line: 'Feature:  Some feature ', number: 1 }, session, state);

    eq(state.count, 1);
  });
});
