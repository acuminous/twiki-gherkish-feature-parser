import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, utils } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('CaptureScenarioDetailsState', () => {
  let machine;
  const expectedEvents = [
    ' - a blank line',
    ' - a block comment delimiter',
    ' - a scenario',
    ' - a single line comment',
    ' - a step',
    ' - an annotation',
    ' - an example table',
    ' - the end of the feature',
  ].join('\n');

  beforeEach(() => {
    const featureBuilder = new FeatureBuilder()
      .createFeature({ title: 'Meh' })
      .createScenario({ title: 'First scenario' })
      .createStep({ text: 'First step' });

    machine = new StateMachine({ featureBuilder }, true)
      .toDeclareFeatureState()
      .checkpoint()
      .toDeclareScenarioState()
      .toCaptureScenarioDetailsState();
  });

  describe('An annotation', () => {
    it('should not cause a state transition', () => {
      interpret('@foo=bar');
      eq(machine.state, 'CaptureScenarioDetailsState');
    });
  });

  describe('A background', () => {
    it('should be unexpected', () => {
      throws(() => interpret('Background: foo'), { message: `I did not expect a background at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('A blank line', () => {
    it('should not cause a state transition', () => {
      interpret('');
      eq(machine.state, 'CaptureScenarioDetailsState');
    });
  });

  describe('A block comment delimiter delimiter', () => {
    it('should cause a transition to BlockCommentState', () => {
      interpret('###');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  describe('An example table', () => {
    it('should cause a transition to DeclareExampleTableState', () => {
      interpret('Where:');
      eq(machine.state, 'DeclareExampleTableState');
    });
  });

  describe('An explicit docstring delimiter', () => {
    it('should be unexpected', () => {
      throws(() => interpret('---'), { message: `I did not expect the start of an explicit docstring at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('An implicit docstring', () => {
    it('should be unexpected', () => {
      throws(() => interpret('   some text'), { message: `I did not expect the start of an implicit docstring at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('The end of the feature', () => {
    it('should cause a transition to FinalState', () => {
      interpret('\u0000');
      eq(machine.state, 'FinalState');
    });
  });

  describe('A feature', () => {
    it('should be unexpected', () => {
      throws(() => interpret('Feature: foo'), { message: `I did not expect a feature at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('A single line comment', () => {
    it('should not cause a state transition', () => {
      interpret('# Some comment');
      eq(machine.state, 'CaptureScenarioDetailsState');
    });
  });

  describe('A scenario', () => {
    it('should cause a transition to DeclareScenarioState', () => {
      interpret('Scenario: First scenario');
      eq(machine.state, 'DeclareScenarioState');
    });

    it('should be captured without annotations', () => {
      interpret('Scenario: Second scenario');

      const exported = machine.build();
      eq(exported.scenarios.length, 2);
      eq(exported.scenarios[1].title, 'Second scenario');
      eq(exported.scenarios[1].annotations.length, 0);
    });

    it('should be captured with annotations', () => {
      interpret('@one = 1');
      interpret('@two = 2');
      interpret('Scenario: Second scenario');

      const exported = machine.build();
      eq(exported.scenarios.length, 2);
      eq(exported.scenarios[1].annotations.length, 2);
      eq(exported.scenarios[1].annotations[0].name, 'one');
      eq(exported.scenarios[1].annotations[0].value, '1');
      eq(exported.scenarios[1].annotations[1].name, 'two');
      eq(exported.scenarios[1].annotations[1].value, '2');
    });

    it('should append scenarios', () => {
      interpret('Scenario: Second scenario');
      interpret('Some text');
      interpret('Scenario: Third scenario');

      const exported = machine.build();
      eq(exported.scenarios.length, 3);
      eq(exported.scenarios[0].title, 'First scenario');
      eq(exported.scenarios[1].title, 'Second scenario');
      eq(exported.scenarios[2].title, 'Third scenario');
    });
  });

  describe('A line of text', () => {
    it('should cause a transition to CaptureStepState', () => {
      interpret('Second step');

      eq(machine.state, 'CaptureStepState');
    });

    it('should be captured without annotations', () => {
      interpret('Second step');

      const exported = machine.build();
      eq(exported.scenarios[0].steps.length, 2);
      eq(exported.scenarios[0].steps[1].text, 'Second step');
      eq(exported.scenarios[0].steps[1].annotations.length, 0);
    });

    it('should be captured with annotations', () => {
      interpret('@one=1');
      interpret('@two=2');
      interpret('Second step');

      const exported = machine.build();
      eq(exported.scenarios[0].steps[1].annotations.length, 2);
      deq(exported.scenarios[0].steps[1].annotations[0], { name: 'one', value: '1' });
      deq(exported.scenarios[0].steps[1].annotations[1], { name: 'two', value: '2' });
    });
  });

  function interpret(line, number = 1, indentation = utils.getIndentation(line)) {
    machine.interpret({ line, number, indentation });
  }
});
