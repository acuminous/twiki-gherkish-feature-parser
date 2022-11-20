import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, States, Events } from '../../lib/index.js';
import StubSession from '../stubs/StubSession.js';
import StateMachineTestBuilder from './StateMachineTestBuilder.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('BeginExplicitDocstringState', () => {

  const testBuilder = new StateMachineTestBuilder().beforeEach(() => {
    const featureBuilder = new FeatureBuilder()
      .createFeature({ title: 'Meh' })
      .createBackground({ title: 'Meh' })
      .createStep({ text: 'Meh' });

    const session = new StubSession()
      .beginExplicitDocstring('---', 0);

    const machine = new StateMachine({ featureBuilder, session })
      .toBeginExplicitDocstringState();

    testBuilder.assign({ machine,
      featureBuilder,
      expectedEvents: [
        Events.DocstringTextEvent,
      ] });
  });

  testBuilder.interpreting('@foo=bar')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.CaptureExplicitDocstringState)
    .shouldCapture('docstring', (feature) => {
      eq(feature.background.steps[0].docstring, '@foo=bar');
    });

  testBuilder.interpreting('Background:')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.CaptureExplicitDocstringState)
    .shouldCapture('docstring', (feature) => {
      eq(feature.background.steps[0].docstring, 'Background:');
    });

  testBuilder.interpreting('')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.CaptureExplicitDocstringState)
    .shouldCapture('docstring', (feature) => {
      eq(feature.background.steps[0].docstring, '');
    });

  testBuilder.interpreting('Where:')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.CaptureExplicitDocstringState)
    .shouldCapture('docstring', (feature) => {
      eq(feature.background.steps[0].docstring, 'Where:');
    });

  testBuilder.interpreting('---')
    .shouldBeUnexpected('the end of an explicit docstring');

  testBuilder.interpreting('\u0000')
    .shouldBeUnexpected('the end of the feature');

  testBuilder.interpreting('Feature:')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.CaptureExplicitDocstringState)
    .shouldCapture('docstring', (feature) => {
      eq(feature.background.steps[0].docstring, 'Feature:');
    });

  testBuilder.interpreting('Rule:')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.CaptureExplicitDocstringState)
    .shouldCapture('docstring', (feature) => {
      eq(feature.background.steps[0].docstring, 'Rule:');
    });

  testBuilder.interpreting('Scenario:')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.CaptureExplicitDocstringState)
    .shouldCapture('docstring', (feature) => {
      eq(feature.background.steps[0].docstring, 'Scenario:');
    });

  testBuilder.interpreting('# some comment')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.CaptureExplicitDocstringState)
    .shouldCapture('docstring', (feature) => {
      eq(feature.background.steps[0].docstring, '# some comment');
    });

  testBuilder.interpreting('###')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.CaptureExplicitDocstringState)
    .shouldCapture('docstring', (feature) => {
      eq(feature.background.steps[0].docstring, '###');
    });

  testBuilder.interpreting('some text')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.CaptureExplicitDocstringState)
    .shouldCapture('docstring', (feature) => {
      eq(feature.background.steps[0].docstring, 'some text');
    });

  testBuilder.interpreting('   some text')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.CaptureExplicitDocstringState)
    .shouldCapture('docstring', (feature) => {
      eq(feature.background.steps[0].docstring, '   some text');
    });
});
