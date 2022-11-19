import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, States, Events } from '../../lib/index.js';
import StubSession from '../stubs/StubSession.js';
import StateMachineTestBuilder from './StateMachineTestBuilder.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('DeclareExampleTableState', () => {

  const testBuilder = new StateMachineTestBuilder().beforeEach(() => {
    const featureBuilder = new FeatureBuilder()
      .createFeature({ title: 'Meh' })
      .createScenario({ title: 'Meh' })
      .createStep({ text: 'First step' });

    const session = new StubSession()
      .countExampleHeadings(['a', 'b', 'c']);

    const machine = new StateMachine({ featureBuilder, session })
      .toStubState()
      .checkpoint()
      .toDeclareExampleTableState();

    testBuilder.featureBuilder = featureBuilder;
    testBuilder.machine = machine;
    testBuilder.expectedEvents = [
      Events.BlankLineEvent,
      Events.BlockCommentDelimiterEvent,
      Events.ExampleTableHeaderRowEvent,
      Events.SingleLineCommentEvent,
    ];
  });

  testBuilder.interpreting('@foo=bar')
    .shouldBeUnexpected('an annotation');

  testBuilder.interpreting('Background:')
    .shouldBeUnexpected('a background');

  testBuilder.interpreting('')
    .shouldNotCheckpoint()
    .shouldNotTransition();

  testBuilder.interpreting('Where:')
    .shouldBeUnexpected('an example table');

  testBuilder.interpreting('| a | b | c |')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.CaptureExampleTableHeadingsState)
    .shouldCapture('example table headings', (feature) => {
      eq(feature.scenarios[0].examples.headings.length, 3);
      eq(feature.scenarios[0].examples.headings[0], 'a');
      eq(feature.scenarios[0].examples.headings[1], 'b');
      eq(feature.scenarios[0].examples.headings[2], 'c');
    });

  testBuilder.interpreting('|---|---|---|')
    .shouldBeUnexpected('an example table separator row');

  testBuilder.interpreting('---')
    .shouldBeUnexpected('the start of an explicit docstring');

  testBuilder.interpreting('\u0000')
    .shouldBeUnexpected('the end of the feature');

  testBuilder.interpreting('Feature:')
    .shouldBeUnexpected('a feature');

  testBuilder.interpreting('Rule:')
    .shouldBeUnexpected('a rule');

  testBuilder.interpreting('Scenario:')
    .shouldBeUnexpected('a scenario');

  testBuilder.interpreting('# some comment')
    .shouldNotCheckpoint()
    .shouldNotTransition();

  testBuilder.interpreting('###')
    .shouldCheckpoint()
    .shouldTransitionTo(States.ConsumeBlockCommentState);

  testBuilder.interpreting('some text')
    .shouldBeUnexpected('a step');

  testBuilder.interpreting('   some text')
    .shouldBeUnexpected('the start of an implicit docstring');
});
