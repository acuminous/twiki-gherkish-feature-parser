import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, States, Events } from '../../lib/index.js';
import StubSession from '../stubs/StubSession.js';
import StateMachineTestBuilder from './StateMachineTestBuilder.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('CaptureRuleBackgroundStepState', () => {

  const testBuilder = new StateMachineTestBuilder().beforeEach(() => {
    const featureBuilder = new FeatureBuilder()
      .createFeature({ title: 'Meh' })
      .createBackground({ title: 'Meh' })
      .createStep({ text: 'First step' });

    const session = new StubSession();

    const machine = new StateMachine({ featureBuilder, session })
      .toCaptureRuleBackgroundStepState();

    testBuilder.assign({
      machine,
      featureBuilder,
      expectedEvents: [
        Events.AnnotationEvent,
        Events.BlankLineEvent,
        Events.BlockCommentDelimiterEvent,
        Events.ExplicitDocstringStartEvent,
        Events.ImplicitDocstringStartEvent,
        Events.ScenarioEvent,
        Events.SingleLineCommentEvent,
        Events.StepEvent,
      ] });
  });

  testBuilder.interpreting('@foo=bar')
    .shouldCheckpoint()
    .shouldTransitionTo(States.CaptureAnnotationState)
    .shouldStashAnnotation((annotations) => {
      eq(annotations.length, 1);
      eq(annotations[0].name, 'foo');
      eq(annotations[0].value, 'bar');
    })
    .shouldCheckpoint();

  testBuilder.interpreting('Background:')
    .shouldBeUnexpected('a background');

  testBuilder.interpreting('')
    .shouldNotCheckpoint()
    .shouldNotTransition();

  testBuilder.interpreting('Where:')
    .shouldBeUnexpected('an example table');

  testBuilder.interpreting('\u0000')
    .shouldBeUnexpected('the end of the feature');

  testBuilder.interpreting('---')
    .shouldCheckpoint()
    .shouldTransitionTo(States.BeginExplicitDocstringState)
    .shouldAlias(States.EndRuleBackgroundDocstringState);

  testBuilder.interpreting('Feature:')
    .shouldBeUnexpected('a feature');

  testBuilder.interpreting('Rule:')
    .shouldBeUnexpected('a rule');

  testBuilder.interpreting('Scenario:')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.DeclareScenarioState)
    .shouldCapture('a scenario', (feature) => {
      eq(feature.scenarios.length, 1);
      eq(feature.scenarios[0].title, '');
    });

  testBuilder.interpreting('Scenario: A scenario')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.DeclareScenarioState)
    .shouldCapture('a scenario', (feature) => {
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
    .shouldTransitionTo(States.CaptureRuleBackgroundStepState)
    .shouldCapture('step', (feature) => {
      eq(feature.background.steps.length, 2);
      eq(feature.background.steps[1].text, 'some text');
    });

  testBuilder.interpreting('   some text')
    .shouldCheckpoint()
    .shouldTransitionTo(States.CaptureImplicitDocstringState)
    .shouldAlias(States.EndRuleBackgroundDocstringState)
    .shouldCapture('docstring text', (feature) => {
      eq(feature.background.steps[0].docstring, 'some text');
    });
});
