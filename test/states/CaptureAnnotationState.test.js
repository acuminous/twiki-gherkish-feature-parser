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

    testBuilder.assign({
      machine,
      featureBuilder,
      expectedEvents: [
        Events.AnnotationEvent,
        Events.BackgroundEvent,
        Events.BlankLineEvent,
        Events.BlockCommentDelimiterEvent,
        Events.FeatureEvent,
        Events.RuleEvent,
        Events.ScenarioEvent,
        Events.SingleLineCommentEvent,
        Events.StepEvent,
      ] });
  });

  testBuilder.interpreting('@foo=bar')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.CaptureAnnotationState)
    .shouldStashAnnotation((annotations) => {
      eq(annotations.length, 1);
      eq(annotations[0].name, 'foo');
      eq(annotations[0].value, 'bar');
    });

  testBuilder.interpreting('Background: A background')
    .shouldNotCheckpoint()
    .shouldUnwind()
    .shouldDispatch(Events.BackgroundEvent, (context) => {
      eq(context.data.title, 'A background');
    });

  testBuilder.interpreting('')
    .shouldNotCheckpoint()
    .shouldUnwind()
    .shouldDispatch(Events.BlankLineEvent);

  testBuilder.interpreting('Where:')
    .shouldNotCheckpoint()
    .shouldUnwind()
    .shouldDispatch(Events.ExampleTableEvent);

  testBuilder.interpreting('---')
    .shouldNotCheckpoint()
    .shouldUnwind()
    .shouldDispatch(Events.ExplicitDocstringStartEvent);

  testBuilder.interpreting('\u0000')
    .shouldNotCheckpoint()
    .shouldUnwind()
    .shouldDispatch(Events.EndEvent);

  testBuilder.interpreting('Feature: A feature')
    .shouldNotCheckpoint()
    .shouldUnwind()
    .shouldDispatch(Events.FeatureEvent, (context) => {
      eq(context.data.title, 'A feature');
    });

  testBuilder.interpreting('Rule: A rule')
    .shouldNotCheckpoint()
    .shouldUnwind()
    .shouldDispatch(Events.RuleEvent, (context) => {
      eq(context.data.title, 'A rule');
    });

  testBuilder.interpreting('Scenario: A scenario')
    .shouldNotCheckpoint()
    .shouldUnwind()
    .shouldDispatch(Events.ScenarioEvent, (context) => {
      eq(context.data.title, 'A scenario');
    });

  testBuilder.interpreting('# some comment')
    .shouldNotCheckpoint()
    .shouldUnwind()
    .shouldDispatch(Events.SingleLineCommentEvent);

  testBuilder.interpreting('###')
    .shouldNotCheckpoint()
    .shouldUnwind()
    .shouldDispatch(Events.BlockCommentDelimiterEvent);

  testBuilder.interpreting('some text')
    .shouldNotCheckpoint()
    .shouldUnwind()
    .shouldDispatch(Events.StepEvent, (context) => {
      eq(context.data.text, 'some text');
    });

  testBuilder.interpreting('   some text')
    .shouldNotCheckpoint()
    .shouldUnwind()
    .shouldDispatch(Events.ImplicitDocstringStartEvent, (context) => {
      eq(context.data.text, 'some text');
    });

});
