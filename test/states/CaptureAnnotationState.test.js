import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, States, Events } from '../../lib/index.js';
import StubSession from '../stubs/StubSession.js';
import StateMachineTestBuilder from './StateMachineTestBuilder.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('CaptureAnnotationState', () => {

  const testBuilder = new StateMachineTestBuilder().beforeEach(() => {
    const featureBuilder = new FeatureBuilder();
    const session = new StubSession();
    const machine = new StateMachine({ featureBuilder, session })
      .toStubState()
      .checkpoint()
      .toCaptureAnnotationState();

    testBuilder.featureBuilder = featureBuilder;
    testBuilder.machine = machine;
    testBuilder.expectedEvents = [
      Events.AnnotationEvent,
      Events.BackgroundEvent,
      Events.BlankLineEvent,
      Events.BlockCommentDelimiterEvent,
      Events.FeatureEvent,
      Events.RuleEvent,
      Events.ScenarioEvent,
      Events.SingleLineCommentEvent,
      Events.StepEvent,
    ];
  });

  testBuilder.interpreting('@foo=bar')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.CaptureAnnotationState)
    .shouldStashAnnotation((annotations) => {
      eq(annotations.length, 1);
      eq(annotations[0].name, 'foo');
      eq(annotations[0].value, 'bar');
    });

  testBuilder.interpreting('Background:')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.StubState)
    .shouldDispatch(Events.BackgroundEvent, (context) => {
      eq(context.data.title, '');
    });

  testBuilder.interpreting('Background: A background')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.StubState)
    .shouldDispatch(Events.BackgroundEvent, (context) => {
      eq(context.data.title, 'A background');
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
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.StubState)
    .shouldDispatch(Events.FeatureEvent, (context) => {
      eq(context.data.title, '');
    });

  testBuilder.interpreting('Feature: A feature')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.StubState)
    .shouldDispatch(Events.FeatureEvent, (context) => {
      eq(context.data.title, 'A feature');
    });

  testBuilder.interpreting('Rule:')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.StubState)
    .shouldDispatch(Events.RuleEvent, (context) => {
      eq(context.data.title, '');
    });

  testBuilder.interpreting('Rule: A rule')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.StubState)
    .shouldDispatch(Events.RuleEvent, (context) => {
      eq(context.data.title, 'A rule');
    });

  testBuilder.interpreting('Scenario:')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.StubState)
    .shouldDispatch(Events.ScenarioEvent, (context) => {
      eq(context.data.title, '');
    });

  testBuilder.interpreting('Scenario: A scenario')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.StubState)
    .shouldDispatch(Events.ScenarioEvent, (context) => {
      eq(context.data.title, 'A scenario');
    });

  testBuilder.interpreting('# some comment')
    .shouldNotTransition();

  testBuilder.interpreting('###')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.StubState)
    .shouldDispatch(Events.BlockCommentDelimiterEvent);

  testBuilder.interpreting('some text')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.StubState)
    .shouldDispatch(Events.StepEvent, (context) => {
      eq(context.data.text, 'some text');
    });

  testBuilder.interpreting('   some text')
    .shouldBeUnexpected('the start of an implicit docstring');

});
