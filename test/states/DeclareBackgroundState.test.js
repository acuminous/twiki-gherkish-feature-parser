import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, States, Events } from '../../lib/index.js';
import StubSession from '../stubs/StubSession.js';
import StateMachineTestBuilder from './StateMachineTestBuilder.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('DeclareBackgroundState', () => {

  const testBuilder = new StateMachineTestBuilder().beforeEach(() => {
    const featureBuilder = new FeatureBuilder()
      .createFeature({ title: 'Meh' })
      .createBackground({ title: 'Meh' });

    const session = new StubSession();

    const machine = new StateMachine({ featureBuilder, session })
      .toDeclareBackgroundState();

    testBuilder.featureBuilder = featureBuilder;
    testBuilder.machine = machine;
    testBuilder.expectedEvents = [
      Events.AnnotationEvent,
      Events.BlankLineEvent,
      Events.BlockCommentDelimiterEvent,
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
    });

  testBuilder.interpreting('Background:')
    .shouldBeUnexpected('a background');

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
    .shouldBeUnexpected('a scenario');

  testBuilder.interpreting('# some comment')
    .shouldNotTransition();

  testBuilder.interpreting('###')
    .shouldTransitionTo(States.ConsumeBlockCommentState);

  testBuilder.interpreting('some text')
    .shouldTransitionTo(States.CaptureBackgroundStepState)
    .shouldCapture('step', (feature) => {
      eq(feature.background.steps.length, 1);
      eq(feature.background.steps[0].text, 'some text');
    });

  testBuilder.interpreting('   some text')
    .shouldBeUnexpected('the start of an implicit docstring');
});
