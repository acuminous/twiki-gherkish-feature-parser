import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, States, Events } from '../../lib/index.js';
import StubSession from '../stubs/StubSession.js';
import StateMachineTestBuilder from './StateMachineTestBuilder.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('CaptureExampleTableHeadings', () => {

  const testBuilder = new StateMachineTestBuilder().beforeEach(() => {
    const featureBuilder = new FeatureBuilder()
      .createFeature({ title: 'Meh' })
      .createScenario({ title: 'Meh' })
      .createStep({ text: 'First step' })
      .createExampleTable({ headings: ['a', 'b', 'c'] });

    const session = new StubSession()
      .countExampleHeadings(['a', 'b', 'c']);

    const machine = new StateMachine({ featureBuilder, session })
      .toCaptureExampleTableHeadingsState();

    testBuilder.assign({
      machine,
      featureBuilder,
      expectedEvents: [
        Events.ExampleTableSeparatorRowEvent,
      ] });
  });

  testBuilder.interpreting('@foo=bar')
    .shouldBeUnexpected('an annotation');

  testBuilder.interpreting('Background:')
    .shouldBeUnexpected('a background');

  testBuilder.interpreting('')
    .shouldBeUnexpected('a blank line');

  testBuilder.interpreting('Where:')
    .shouldBeUnexpected('an example table');

  testBuilder.interpreting('| a | b | c |')
    .shouldBeUnexpected('an example table header row');

  testBuilder.interpreting('|---|---|---|')
    .shouldNotCheckpoint()
    .shouldTransitionTo(States.ConsumeExampleTableSeparatorRowState);

  testBuilder.interpreting('\u0000')
    .shouldBeUnexpected('the end of the feature');

  testBuilder.interpreting('---')
    .shouldBeUnexpected('the start of an explicit docstring');

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
