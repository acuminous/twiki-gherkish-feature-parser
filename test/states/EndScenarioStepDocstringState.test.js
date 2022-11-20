import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, Events } from '../../lib/index.js';
import StubSession from '../stubs/StubSession.js';
import StateMachineTestBuilder from './StateMachineTestBuilder.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('EndScenarioStepDocstringState', () => {

  const testBuilder = new StateMachineTestBuilder().beforeEach(() => {
    const featureBuilder = new FeatureBuilder()
      .createFeature({ title: 'Meh' })
      .createBackground({ title: 'Meh' })
      .createStep({ text: 'First step' });

    const session = new StubSession();

    const machine = new StateMachine({ featureBuilder, session })
      .toStubState()
      .checkpoint()
      .toEndScenarioStepDocstringState();

    testBuilder.assign({
      machine,
      featureBuilder,
      expectedEvents: [
        Events.AnnotationEvent,
        Events.BlankLineEvent,
        Events.BlockCommentDelimiterEvent,
        Events.EndEvent,
        Events.ExampleTableEvent,
        Events.RuleEvent,
        Events.ScenarioEvent,
        Events.SingleLineCommentEvent,
        Events.StepEvent,
      ] });
  });

  testBuilder.interpreting('@foo=bar')
    .shouldNotCheckpoint()
    .shouldUnwind()
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
    .shouldUnwind()
    .shouldDispatch(Events.BlankLineEvent);

  testBuilder.interpreting('Where:')
    .shouldNotCheckpoint()
    .shouldUnwind()
    .shouldDispatch(Events.ExampleTableEvent);

  testBuilder.interpreting('---')
    .shouldBeUnexpected('the start of an explicit docstring');

  testBuilder.interpreting('\u0000')
    .shouldNotCheckpoint()
    .shouldUnwind()
    .shouldDispatch(Events.EndEvent);

  testBuilder.interpreting('Feature:')
    .shouldBeUnexpected('a feature');

  testBuilder.interpreting('Feature: A feature')
    .shouldBeUnexpected('a feature');

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
    .shouldBeUnexpected('the start of an implicit docstring');

});
