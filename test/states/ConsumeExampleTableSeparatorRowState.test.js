import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { StateMachine, FeatureBuilder, Events, States, Session } from '../../lib/index.js';

import StateMachineTestBuilder from './StateMachineTestBuilder.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('ConsumeExampleTableSeparatorRowState', () => {

  const testBuilder = new StateMachineTestBuilder().beforeEach(() => {
    const featureBuilder = new FeatureBuilder()
      .createFeature({ title: 'Meh' })
      .createScenario({ title: 'Meh' })
      .createStep({ text: 'First step' })
      .createExampleTable({ headings: ['a', 'b', 'c'] });

    const session = new Session()
      .countExampleHeadings(['a', 'b', 'c']);

    const machine = new StateMachine({ session, featureBuilder })
      .toStubState()
      .checkpoint()
      .toConsumeExampleTableSeparatorRowState();

    testBuilder.assign({
      machine,
      featureBuilder,
      expectedEvents: [
        Events.AnnotationEvent,
        Events.ExampleTableDataRowEvent,
      ],
    });
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
    .shouldBeUnexpected('a blank line');

  testBuilder.interpreting('Where:')
    .shouldBeUnexpected('an example table');

  testBuilder.interpreting('|---|---|---|')
    .shouldBeUnexpected('an example table separator row');

  testBuilder.interpreting('| 1 | 2 | 3 |')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.CaptureExampleTableExampleState)
    .shouldCapture('examples', (feature) => {
      eq(feature.scenarios[0].examples.rows.length, 1);
      eq(feature.scenarios[0].examples.rows[0].a, '1');
      eq(feature.scenarios[0].examples.rows[0].b, '2');
      eq(feature.scenarios[0].examples.rows[0].c, '3');
    });

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
    .shouldBeUnexpected('a single line comment');

  testBuilder.interpreting('###')
    .shouldBeUnexpected('a block comment delimiter');

  testBuilder.interpreting('some text')
    .shouldBeUnexpected('a step');

  testBuilder.interpreting('   some text')
    .shouldBeUnexpected('the start of an implicit docstring');
});
