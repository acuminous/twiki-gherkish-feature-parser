import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, States, Events, Session } from '../../lib/index.js';

import StateMachineTestBuilder from './StateMachineTestBuilder.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('DeclareFeatureState', () => {

  const testBuilder = new StateMachineTestBuilder().beforeEach(() => {
    const featureBuilder = new FeatureBuilder()
      .createFeature({ title: 'Meh' });

    const session = new Session();

    const machine = new StateMachine({ featureBuilder, session })
      .toDeclareFeatureState();

    testBuilder.assign({
      machine,
      featureBuilder,
      expectedEvents: [
        Events.AnnotationEvent,
        Events.BackgroundEvent,
        Events.BlankLineEvent,
        Events.BlockCommentDelimiterEvent,
        Events.RuleEvent,
        Events.ScenarioEvent,
        Events.SingleLineCommentEvent,
        Events.TextEvent,
      ] });
  });

  testBuilder.interpreting('@foo=bar')
    .shouldCheckpoint()
    .shouldTransitionTo(States.CaptureAnnotationState)
    .shouldStashAnnotation((annotations) => {
      eq(annotations.length, 1);
      eq(annotations[0].name, 'foo');
      eq(annotations[0].value, 'bar');
    });

  testBuilder.interpreting('Background:')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.DeclareFeatureBackgroundState)
    .shouldCapture('title', (feature) => {
      eq(feature.background.title, '');
    });

  testBuilder.interpreting('Background: A background')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.DeclareFeatureBackgroundState)
    .shouldCapture('title', (feature) => {
      eq(feature.background.title, 'A background');
    });

  testBuilder.interpreting('')
    .shouldNotCheckpoint()
    .shouldNotTransition();

  testBuilder.interpreting('Where:')
    .shouldBeUnexpected('an example table');

  testBuilder.interpreting('---')
    .shouldBeUnexpected('the start of an explicit docstring');

  testBuilder.interpreting('\u0000')
    .shouldBeUnexpected('the end of the feature');

  testBuilder.interpreting('Feature:')
    .shouldBeUnexpected('a feature');

  testBuilder.interpreting('Rule:')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.DeclareRuleState)
    .shouldCapture('title', (feature) => {
      eq(feature.rules.length, 1);
      eq(feature.rules[0].title, '');
    });

  testBuilder.interpreting('Rule: A rule')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.DeclareRuleState)
    .shouldCapture('A rule', (feature) => {
      eq(feature.rules.length, 1);
      eq(feature.rules[0].title, 'A rule');
    });

  testBuilder.interpreting('Scenario:')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.DeclareScenarioState)
    .shouldCapture('title', (feature) => {
      eq(feature.scenarios.length, 1);
      eq(feature.scenarios[0].title, '');
    });

  testBuilder.interpreting('Scenario: A scenario')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.DeclareScenarioState)
    .shouldCapture('A scenario', (feature) => {
      eq(feature.scenarios.length, 1);
      eq(feature.scenarios[0].title, 'A scenario');
    });

  testBuilder.interpreting('# some comment')
    .shouldNotCheckpoint()
    .shouldNotTransition();

  testBuilder.interpreting('###')
    .shouldCheckpoint()
    .shouldTransitionTo(States.ConsumeBlockCommentState);

  testBuilder.interpreting('some text')
    .shouldNotCheckpoint()
    .shouldNotTransition()
    .shouldCapture('description', (feature) => {
      eq(feature.description, 'some text');
    });

  testBuilder.interpreting('   some text')
    .shouldNotCheckpoint()
    .shouldNotTransition()
    .shouldCapture('description', (feature) => {
      eq(feature.description, 'some text');
    });
});
