import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, States, Events } from '../../lib/index.js';
import StubSession from '../stubs/StubSession.js';
import StateMachineTestBuilder from './StateMachineTestBuilder.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('DeclareRuleState', () => {

  const testBuilder = new StateMachineTestBuilder().beforeEach(() => {
    const featureBuilder = new FeatureBuilder()
      .createFeature({ title: 'Meh' });

    const session = new StubSession();

    const machine = new StateMachine({ featureBuilder, session })
      .toDeclareRuleState();

    testBuilder.featureBuilder = featureBuilder;
    testBuilder.machine = machine;
    testBuilder.expectedEvents = [
      Events.AnnotationEvent,
      Events.BackgroundEvent,
      Events.BlankLineEvent,
      Events.BlockCommentDelimiterEvent,
      Events.ScenarioEvent,
      Events.SingleLineCommentEvent,
      Events.TextEvent,
    ];
  });

  testBuilder.interpreting('@foo=bar')
    .shouldTransitionTo(States.CaptureAnnotationState)
    .shouldStashAnnotation((annotations) => {
      eq(annotations.length, 1);
      eq(annotations[0].name, 'foo');
      eq(annotations[0].value, 'bar');
    })
    .shouldCheckpoint();

  testBuilder.interpreting('Background:')
    .shouldTransitionTo(States.DeclareRuleBackgroundState)
    .shouldCapture('title', (feature) => {
      eq(feature.background.title, '');
    });

  testBuilder.interpreting('Background: A background')
    .shouldTransitionTo(States.DeclareRuleBackgroundState)
    .shouldCapture('title', (feature) => {
      eq(feature.background.title, 'A background');
    });

  testBuilder.interpreting('')
    .shouldNotTransition();

  testBuilder.interpreting('Where:')
    .shouldBeUnexpected('an example table');

  testBuilder.interpreting('---')
    .shouldBeUnexpected('the start of an explicit docstring');

  testBuilder.interpreting('\u0000')
    .shouldBeUnexpected('the end of the feature');

  testBuilder.interpreting('Feature:')
    .shouldBeUnexpected('a feature');

  testBuilder.interpreting('Scenario:')
    .shouldTransitionTo(States.DeclareScenarioState)
    .shouldCapture('title', (feature) => {
      eq(feature.scenarios.length, 1);
      eq(feature.scenarios[0].title, '');
    });

  testBuilder.interpreting('Scenario: A scenario')
    .shouldTransitionTo(States.DeclareScenarioState)
    .shouldCapture('A scenario', (feature) => {
      eq(feature.scenarios.length, 1);
      eq(feature.scenarios[0].title, 'A scenario');
    });

  testBuilder.interpreting('# some comment')
    .shouldNotTransition();

  testBuilder.interpreting('###')
    .shouldTransitionTo(States.ConsumeBlockCommentState)
    .shouldCheckpoint();

  testBuilder.interpreting('some text')
    .shouldNotTransition()
    .shouldCapture('description', (feature) => {
      eq(feature.description, 'some text');
    });

  testBuilder.interpreting('   some text')
    .shouldNotTransition()
    .shouldCapture('description', (feature) => {
      eq(feature.description, '   some text');
    });
});
