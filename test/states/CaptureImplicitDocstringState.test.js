import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, States, Events } from '../../lib/index.js';
import StubSession from '../stubs/StubSession.js';
import StateMachineTestBuilder from './StateMachineTestBuilder.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('CaptureImplicitDocstringState', () => {

  const testBuilder = new StateMachineTestBuilder().beforeEach(() => {
    const featureBuilder = new FeatureBuilder()
      .createFeature({ title: 'Meh' })
      .createBackground({ title: 'Meh' })
      .createStep({ text: 'Meh' });

    const session = new StubSession()
      .beginImplicitDocstring(3);

    const machine = new StateMachine({ featureBuilder, session })
      .toCaptureFeatureBackgroundStepState()
      .checkpoint()
      .alias(States.EndFeatureBackgroundDocstringState)
      .toCaptureImplicitDocstringState();

    testBuilder.featureBuilder = featureBuilder;
    testBuilder.machine = machine;
    testBuilder.expectedEvents = [
      Events.AnnotationEvent,
      Events.BlankLineEvent,
      Events.BlockCommentDelimiterEvent,
      Events.RuleEvent,
      Events.ScenarioEvent,
      Events.SingleLineCommentEvent,
      Events.StepEvent,
    ];
  });

  testBuilder.interpreting('   @foo=bar')
    .shouldNotCheckpoint()
    .shouldNotTransition()
    .shouldCapture('docstring', (feature) => {
      eq(feature.background.steps[0].docstring, '@foo=bar');
    });

  testBuilder.interpreting('@foo=bar')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.CaptureAnnotationState)
    .shouldStashAnnotation((annotations) => {
      eq(annotations.length, 1);
      eq(annotations[0].name, 'foo');
      eq(annotations[0].value, 'bar');
    });

  testBuilder.interpreting('   Background:')
    .shouldNotCheckpoint()
    .shouldNotTransition()
    .shouldCapture('docstring', (feature) => {
      eq(feature.background.steps[0].docstring, 'Background:');
    });

  testBuilder.interpreting('Background:')
    .shouldBeUnexpected('a background');

  testBuilder.interpreting('   ')
    .shouldNotCheckpoint()
    .shouldNotTransition()
    .shouldCapture('docstring', (feature) => {
      eq(feature.background.steps[0].docstring, '');
    });

  testBuilder.interpreting('')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.CaptureFeatureBackgroundStepState);

  testBuilder.interpreting('   Where:')
    .shouldNotCheckpoint()
    .shouldNotTransition()
    .shouldCapture('docstring', (feature) => {
      eq(feature.background.steps[0].docstring, 'Where:');
    });

  testBuilder.interpreting('Where:')
    .shouldBeUnexpected('an example table');

  testBuilder.interpreting('   ---')
    .shouldNotCheckpoint()
    .shouldNotTransition()
    .shouldCapture('docstring', (feature) => {
      eq(feature.background.steps[0].docstring, '---');
    });

  testBuilder.interpreting('---')
    .shouldBeUnexpected('the start of an explicit docstring');

  testBuilder.interpreting('\u0000')
    .shouldBeUnexpected('the end of the feature');

  testBuilder.interpreting('   Feature:')
    .shouldNotCheckpoint()
    .shouldNotTransition()
    .shouldCapture('docstring', (feature) => {
      eq(feature.background.steps[0].docstring, 'Feature:');
    });

  testBuilder.interpreting('Feature:')
    .shouldBeUnexpected('a feature');

  testBuilder.interpreting('   Rule:')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.CaptureImplicitDocstringState)
    .shouldCapture('docstring', (feature) => {
      eq(feature.background.steps[0].docstring, 'Rule:');
    });

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
    .shouldCapture('title', (feature) => {
      eq(feature.rules.length, 1);
      eq(feature.rules[0].title, 'A rule');
    });

  testBuilder.interpreting('   Scenario:')
    .shouldNotCheckpoint()
    .shouldNotTransition()
    .shouldCapture('docstring', (feature) => {
      eq(feature.background.steps[0].docstring, 'Scenario:');
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
    .shouldCapture('title', (feature) => {
      eq(feature.scenarios.length, 1);
      eq(feature.scenarios[0].title, 'A scenario');
    });

  testBuilder.interpreting('   # some comment')
    .shouldNotCheckpoint()
    .shouldNotTransition()
    .shouldCapture('docstring', (feature) => {
      eq(feature.background.steps[0].docstring, '# some comment');
    });

  testBuilder.interpreting('# some comment')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.CaptureFeatureBackgroundStepState);

  testBuilder.interpreting('   ###')
    .shouldNotCheckpoint()
    .shouldNotTransition()
    .shouldCapture('docstring', (feature) => {
      eq(feature.background.steps[0].docstring, '###');
    });

  testBuilder.interpreting('###')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.ConsumeBlockCommentState);

  testBuilder.interpreting('   some text')
    .shouldNotCheckpoint()
    .shouldNotTransition()
    .shouldCapture('docstring', (feature) => {
      eq(feature.background.steps[0].docstring, 'some text');
    });

  testBuilder.interpreting('some text')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.CaptureFeatureBackgroundStepState)
    .shouldCapture('step', (feature) => {
      eq(feature.background.steps.length, 2);
      eq(feature.background.steps[1].text, 'some text');
    });

  testBuilder.interpreting('      some text')
    .shouldNotCheckpoint()
    .shouldNotTransition()
    .shouldCapture('docstring', (feature) => {
      eq(feature.background.steps[0].docstring, '   some text');
    });
});
