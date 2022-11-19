import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, States, Events } from '../../lib/index.js';
import StubSession from '../stubs/StubSession.js';
import StateMachineTestBuilder from './StateMachineTestBuilder.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('InitialState', () => {

  const testBuilder = new StateMachineTestBuilder().beforeEach(() => {
    const featureBuilder = new FeatureBuilder();
    const session = new StubSession();
    const machine = new StateMachine({ featureBuilder, session });

    testBuilder.featureBuilder = featureBuilder;
    testBuilder.machine = machine;
    testBuilder.expectedEvents = [
      Events.AnnotationEvent,
      Events.BlockCommentDelimiterEvent,
      Events.BlankLineEvent,
      Events.FeatureEvent,
      Events.SingleLineCommentEvent,
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

  testBuilder.interpreting('\u0000')
    .shouldBeUnexpected('the end of the feature');

  testBuilder.interpreting('Where:')
    .shouldBeUnexpected('an example table');

  testBuilder.interpreting('---')
    .shouldBeUnexpected('the start of an explicit docstring');

  testBuilder.interpreting('Feature:')
    .shouldTransitionTo(States.DeclareFeatureState)
    .shouldCapture('title', (feature) => {
      eq(feature.title, '');
    });

  testBuilder.interpreting('Feature: A feature')
    .shouldTransitionTo(States.DeclareFeatureState)
    .shouldCapture('title', (feature) => {
      eq(feature.title, 'A feature');
    });

  testBuilder.interpreting('Rule:')
    .shouldBeUnexpected('a rule');

  testBuilder.interpreting('Scenario:')
    .shouldBeUnexpected('a scenario');

  testBuilder.interpreting('# some comment')
    .shouldNotTransition();

  testBuilder.interpreting('###')
    .shouldTransitionTo(States.ConsumeBlockCommentState)
    .shouldCheckpoint();

  testBuilder.interpreting('some text')
    .shouldBeUnexpected('some text');

  testBuilder.interpreting('   some text')
    .shouldBeUnexpected('some text');
});
