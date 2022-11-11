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
      Events.ScenarioEvent,
      Events.SingleLineCommentEvent,
      Events.StepEvent,
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
    .shouldBeUnexpected('a background');

  testBuilder.interpreting('')
    .shouldNotTransition();

  testBuilder.interpreting('Where:')
    .shouldTransitionTo(States.DeclareExampleTableState)
    .shouldCheckpoint();

  testBuilder.interpreting('\u0000')
    .shouldTransitionTo(States.FinalState);

  testBuilder.interpreting('---')
    .shouldTransitionTo(States.BeginExplicitDocstringState);

  testBuilder.interpreting('Feature:')
    .shouldBeUnexpected('a feature');

  testBuilder.interpreting('Scenario:')
    .shouldTransitionTo(States.DeclareScenarioState)
    .shouldCapture('a scenario', (feature) => {
      eq(feature.scenarios.length, 2);
      eq(feature.scenarios[1].title, '');
    });

  testBuilder.interpreting('Scenario: A scenario')
    .shouldTransitionTo(States.DeclareScenarioState)
    .shouldCapture('a scenario', (feature) => {
      eq(feature.scenarios.length, 2);
      eq(feature.scenarios[1].title, 'A scenario');
    });

  testBuilder.interpreting('# some comment')
    .shouldNotTransition();

  testBuilder.interpreting('###')
    .shouldTransitionTo(States.ConsumeBlockCommentState)
    .shouldCheckpoint();

  testBuilder.interpreting('some text')
    .shouldTransitionTo(States.CaptureScenarioStepState)
    .shouldCapture('step', (feature) => {
      eq(feature.scenarios[0].steps.length, 2);
      eq(feature.scenarios[0].steps[1].text, 'some text');
    });

  testBuilder.interpreting('   some text')
    .shouldTransitionTo(States.CaptureImplicitDocstringState)
    .shouldCapture('docstring text', (feature) => {
      eq(feature.scenarios[0].steps[0].docstring, 'some text');
    });
});
