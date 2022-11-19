import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, States, Events } from '../../lib/index.js';
import StubSession from '../stubs/StubSession.js';
import StateMachineTestBuilder from './StateMachineTestBuilder.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('CaptureExampleTableExample', () => {

  const testBuilder = new StateMachineTestBuilder().beforeEach(() => {
    const featureBuilder = new FeatureBuilder()
      .createFeature({ title: 'Meh' })
      .createScenario({ title: 'Meh' })
      .createStep({ text: 'First step' })
      .createExampleTable({ headings: ['a', 'b', 'c'] });

    const session = new StubSession()
      .countExampleHeadings(['a', 'b', 'c']);

    const machine = new StateMachine({ featureBuilder, session })
      .toStubState()
      .checkpoint()
      .toCaptureExampleTableExampleState();

    testBuilder.featureBuilder = featureBuilder;
    testBuilder.machine = machine;
    testBuilder.expectedEvents = [
      Events.AnnotationEvent,
      Events.BlankLineEvent,
      Events.BlockCommentDelimiterEvent,
      Events.EndEvent,
      Events.ExampleTableDataRowEvent,
      Events.RuleEvent,
      Events.ScenarioEvent,
      Events.SingleLineCommentEvent,
    ];
  });

  testBuilder.interpreting('@foo=bar')
    .shouldCheckpoint()
    .shouldTransitionTo(States.CaptureAnnotationState)
    .shouldStashAnnotation((annotations) => {
      eq(annotations.length, 1);
      eq(annotations[0].name, 'foo');
      eq(annotations[0].value, 'bar');
    });

  testBuilder.interpreting('Background:')
    .shouldBeUnexpected('a background');

  testBuilder.interpreting('')
    .shouldNotCheckpoint()
    .shouldUnwind()
    .shouldDispatch(Events.BlankLineEvent);

  testBuilder.interpreting('Where:')
    .shouldBeUnexpected('an example table');

  testBuilder.interpreting('| a | b | c |')
    .shouldNotCheckpoint()
    .shouldCapture('examples', (feature) => {
      eq(feature.scenarios[0].examples.rows.length, 1);
      eq(feature.scenarios[0].examples.rows[0][0], 'a');
      eq(feature.scenarios[0].examples.rows[0][1], 'b');
      eq(feature.scenarios[0].examples.rows[0][2], 'c');
    });

  testBuilder.interpreting('|---|---|---|')
    .shouldBeUnexpected('an example table separator row');

  testBuilder.interpreting('\u0000')
    .shouldNotCheckpoint()
    .shouldUnwind()
    .shouldDispatch(Events.EndEvent);

  testBuilder.interpreting('---')
    .shouldBeUnexpected('the start of an explicit docstring');

  testBuilder.interpreting('Feature:')
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
    .shouldBeUnexpected('a step');

  testBuilder.interpreting('   some text')
    .shouldBeUnexpected('the start of an implicit docstring');
});
