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
      .toStubState()
      .checkpoint()
      .alias(States.EndFeatureBackgroundDocstringState)
      .toCaptureImplicitDocstringState();

    testBuilder.assign({
      machine,
      featureBuilder,
      expectedEvents: [
        Events.AnnotationEvent,
        Events.BlankLineEvent,
        Events.BlockCommentDelimiterEvent,
        Events.RuleEvent,
        Events.ScenarioEvent,
        Events.SingleLineCommentEvent,
        Events.StepEvent,
      ] });
  });

  testBuilder.interpreting('   @foo=bar')
    .shouldNotCheckpoint()
    .shouldNotTransition()
    .shouldCapture('docstring', (feature) => {
      eq(feature.background.steps[0].docstring, '@foo=bar');
    });

  testBuilder.interpreting('@foo=bar')
    .shouldNotCheckpoint()
    .shouldUnwind()
    .shouldDispatch(Events.AnnotationEvent, (context) => {
      eq(context.data.name, 'foo');
      eq(context.data.value, 'bar');
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
    .shouldUnwind()
    .shouldDispatch(Events.BlankLineEvent);

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

  testBuilder.interpreting('Rule: A rule')
    .shouldNotCheckpoint()
    .shouldUnwind()
    .shouldDispatch(Events.RuleEvent, (context) => {
      eq(context.data.title, 'A rule');
    });

  testBuilder.interpreting('   Scenario:')
    .shouldNotCheckpoint()
    .shouldNotTransition()
    .shouldCapture('docstring', (feature) => {
      eq(feature.background.steps[0].docstring, 'Scenario:');
    });

  testBuilder.interpreting('Scenario: A scenario')
    .shouldNotCheckpoint()
    .shouldUnwind()
    .shouldDispatch(Events.ScenarioEvent, (context) => {
      eq(context.data.title, 'A scenario');
    });

  testBuilder.interpreting('   # some comment')
    .shouldNotCheckpoint()
    .shouldNotTransition()
    .shouldCapture('docstring', (feature) => {
      eq(feature.background.steps[0].docstring, '# some comment');
    });

  testBuilder.interpreting('# some comment')
    .shouldNotCheckpoint()
    .shouldUnwind()
    .shouldDispatch(Events.SingleLineCommentEvent);

  testBuilder.interpreting('   ###')
    .shouldNotCheckpoint()
    .shouldNotTransition()
    .shouldCapture('docstring', (feature) => {
      eq(feature.background.steps[0].docstring, '###');
    });

  testBuilder.interpreting('###')
    .shouldNotCheckpoint()
    .shouldUnwind()
    .shouldDispatch(Events.BlockCommentDelimiterEvent);

  testBuilder.interpreting('   some text')
    .shouldNotCheckpoint()
    .shouldNotTransition()
    .shouldCapture('docstring', (feature) => {
      eq(feature.background.steps[0].docstring, 'some text');
    });

  testBuilder.interpreting('some text')
    .shouldNotCheckpoint()
    .shouldUnwind()
    .shouldDispatch(Events.StepEvent, (context) => {
      eq(context.data.text, 'some text');
    });

  testBuilder.interpreting('      some text')
    .shouldNotCheckpoint()
    .shouldNotTransition()
    .shouldCapture('docstring', (feature) => {
      eq(feature.background.steps[0].docstring, '   some text');
    });
});
