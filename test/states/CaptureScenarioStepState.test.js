import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, States, Events } from '../../lib/index.js';
import StubSession from '../stubs/StubSession.js';
import StateMachineTestBuilder from './StateMachineTestBuilder.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('CaptureScenarioStepState', () => {

  const testBuilder = new StateMachineTestBuilder().beforeEach(() => {
    const featureBuilder = new FeatureBuilder()
      .createFeature({ title: 'Meh' })
      .createScenario({ title: 'Meh' })
      .createStep({ text: 'First step' });

    const session = new StubSession();

    const machine = new StateMachine({ featureBuilder, session })
      .toCaptureScenarioStepState();

    testBuilder.featureBuilder = featureBuilder;
    testBuilder.machine = machine;
    testBuilder.expectedEvents = [
      Events.AnnotationEvent,
      Events.BlankLineEvent,
      Events.BlockCommentDelimiterEvent,
      Events.EndEvent,
      Events.ExampleTableEvent,
      Events.ExplicitDocstringStartEvent,
      Events.ImplicitDocstringStartEvent,
      Events.RuleEvent,
      Events.ScenarioEvent,
      Events.SingleLineCommentEvent,
      Events.StepEvent,
    ];
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
    .shouldBeUnexpected('a background');

  testBuilder.interpreting('')
    .shouldNotCheckpoint()
    .shouldNotTransition();

  testBuilder.interpreting('Where:')
    .shouldCheckpoint()
    .shouldTransitionTo(States.DeclareExampleTableState);

  testBuilder.interpreting('\u0000')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.FinalState);

  testBuilder.interpreting('---')
    .shouldCheckpoint()
    .shouldTransitionTo(States.BeginExplicitDocstringState);

  testBuilder.interpreting('Feature:')
    .shouldBeUnexpected('a feature');

  testBuilder.interpreting('Rule:')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.DeclareRuleState)
    .shouldCapture('a rule', (feature) => {
      eq(feature.rules.length, 1);
      eq(feature.rules[0].title, '');
    });

  testBuilder.interpreting('Rule: A rule')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.DeclareRuleState)
    .shouldCapture('a rule', (feature) => {
      eq(feature.rules.length, 1);
      eq(feature.rules[0].title, 'A rule');
    });

  testBuilder.interpreting('Scenario:')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.DeclareScenarioState)
    .shouldCapture('a scenario', (feature) => {
      eq(feature.scenarios.length, 2);
      eq(feature.scenarios[1].title, '');
    });

  testBuilder.interpreting('Scenario: A scenario')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.DeclareScenarioState)
    .shouldCapture('a scenario', (feature) => {
      eq(feature.scenarios.length, 2);
      eq(feature.scenarios[1].title, 'A scenario');
    });

  testBuilder.interpreting('# some comment')
    .shouldNotCheckpoint()
    .shouldNotTransition();

  testBuilder.interpreting('###')
    .shouldCheckpoint()
    .shouldTransitionTo(States.ConsumeBlockCommentState);

  testBuilder.interpreting('some text')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.CaptureScenarioStepState)
    .shouldCapture('step', (feature) => {
      eq(feature.scenarios[0].steps.length, 2);
      eq(feature.scenarios[0].steps[1].text, 'some text');
    });

  testBuilder.interpreting('   some text')
    .shouldCheckpoint()
    .shouldTransitionTo(States.CaptureImplicitDocstringState)
    .shouldCapture('docstring text', (feature) => {
      eq(feature.scenarios[0].steps[0].docstring, 'some text');
    });
});
