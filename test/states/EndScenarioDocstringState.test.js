import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, States, Events } from '../../lib/index.js';
import StubSession from '../stubs/StubSession.js';
import StateMachineTestBuilder from './StateMachineTestBuilder.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('EndScenarioDocstringState', () => {

  const testBuilder = new StateMachineTestBuilder().beforeEach(() => {
    const featureBuilder = new FeatureBuilder()
      .createFeature({ title: 'Meh' })
      .createBackground({ title: 'Meh' })
      .createStep({ text: 'First step' });

    const session = new StubSession();

    const machine = new StateMachine({ featureBuilder, session })
      .toStubState()
      .checkpoint()
      .toEndScenarioDocstringState();

    testBuilder.featureBuilder = featureBuilder;
    testBuilder.machine = machine;
    testBuilder.expectedEvents = [
      Events.AnnotationEvent,
      Events.BlankLineEvent,
      Events.BlockCommentDelimiterEvent,
      Events.EndEvent,
      Events.ExampleTableEvent,
      Events.RuleEvent,
      Events.ScenarioEvent,
      Events.SingleLineCommentEvent,
      Events.StepEvent,
    ];
  });

  testBuilder.interpreting('@foo=bar')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.StubState)
    .shouldDispatch(Events.AnnotationEvent, (context) => {
      eq(context.data.name, 'foo');
      eq(context.data.value, 'bar');
    });

  testBuilder.interpreting('Background:')
    .shouldBeUnexpected('a background');

  testBuilder.interpreting('Background: A background')
    .shouldBeUnexpected('a background');

  testBuilder.interpreting('')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.StubState);

  testBuilder.interpreting('Where:')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.StubState);

  testBuilder.interpreting('---')
    .shouldBeUnexpected('the start of an explicit docstring');

  testBuilder.interpreting('\u0000')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.StubState);

  testBuilder.interpreting('Feature:')
    .shouldBeUnexpected('a feature');

  testBuilder.interpreting('Feature: A feature')
    .shouldBeUnexpected('a feature');

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
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.StubState);

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
