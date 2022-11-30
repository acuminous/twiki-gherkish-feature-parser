import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, States, Events, Session } from '../../lib/index.js';

import StateMachineTestBuilder from './StateMachineTestBuilder.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('CaptureExampleTableExample', () => {

  const testBuilder = new StateMachineTestBuilder().beforeEach(() => {
    const featureBuilder = new FeatureBuilder()
      .createFeature({ title: 'Meh' })
      .createScenario({ title: 'Meh' })
      .createStep({ text: 'First step' })
      .createExampleTable({ headings: ['a', 'b', 'c'] });

    const session = new Session()
      .countExampleHeadings(['a', 'b', 'c']);

    const machine = new StateMachine({ featureBuilder, session })
      .toStubState()
      .checkpoint()
      .toCaptureExampleTableExampleState();

    testBuilder.assign({
      machine,
      featureBuilder,
      expectedEvents: [
        Events.AnnotationEvent,
        Events.BlankLineEvent,
        Events.BlockCommentDelimiterEvent,
        Events.EndEvent,
        Events.ExampleTableDataRowEvent,
        Events.RuleEvent,
        Events.ScenarioEvent,
        Events.SingleLineCommentEvent,
      ] });
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

  testBuilder.interpreting('| 1 | 2 | 3 |')
    .shouldNotCheckpoint()
    .shouldCapture('examples', (feature) => {
      eq(feature.scenarios[0].examples.rows.length, 1);
      eq(feature.scenarios[0].examples.rows[0].a, '1');
      eq(feature.scenarios[0].examples.rows[0].b, '2');
      eq(feature.scenarios[0].examples.rows[0].c, '3');
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
