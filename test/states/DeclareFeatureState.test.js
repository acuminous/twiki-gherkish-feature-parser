import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, utils } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('DeclareFeatureState', () => {
  let machine;
  const expectedEvents = [
    ' - a background',
    ' - a blank line',
    ' - a block comment delimiter',
    ' - a scenario',
    ' - a single line comment',
    ' - an annotation',
    ' - some text',
  ].join('\n');

  beforeEach(() => {
    const featureBuilder = new FeatureBuilder()
      .createFeature({ title: 'Meh' });

    machine = new StateMachine({ featureBuilder }, true)
      .toDeclareFeatureState();
  });

  describe('An annotation', () => {
    it('should not cause a state transition', () => {
      interpret('@foo=bar');
      eq(machine.state, 'DeclareFeatureState');
    });
  });

  describe('A background', () => {
    it('should cause a transition to DeclareBackgroundState', () => {
      interpret('Background: foo');
      eq(machine.state, 'DeclareBackgroundState');
    });

    it('should create a checkpoint', () => {
      interpret('Background: foo');

      machine.toPreviousCheckpoint();
      eq(machine.state, 'DeclareFeatureState');
    });

    it('should capture backgrounds with annotations', () => {
      interpret('@one=1');
      interpret('@two=2');
      interpret('Background: First background');

      const exported = machine.build();
      eq(exported.background.annotations.length, 2);
      eq(exported.background.annotations[0].name, 'one');
      eq(exported.background.annotations[0].value, '1');
      eq(exported.background.annotations[1].name, 'two');
      eq(exported.background.annotations[1].value, '2');
    });
  });

  describe('A blank line', () => {
    it('should not cause a state transition', () => {
      interpret('');
      eq(machine.state, 'DeclareFeatureState');
    });
  });

  describe('A block comment delimiter', () => {
    it('should cause a transition to BlockCommentState', () => {
      interpret('###');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  describe('An example table', () => {
    it('should be unexpected', () => {
      throws(() => interpret('Where:'), { message: `I did not expect an example table at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('An explicit docstring delimiter', () => {
    it('should be unexpected', () => {
      throws(() => interpret('---'), { message: `I did not expect the start of an explicit docstring at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('The end of the feature', () => {
    it('should be unexpected', () => {
      throws(() => interpret('\u0000'), { message: `I did not expect the end of the feature at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
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
      eq(machine.state, 'DeclareFeatureState');
    });
  });

  describe('A scenario', () => {
    it('should cause a transition to DeclareScenarioState', () => {
      interpret('Scenario: First scenario');
      eq(machine.state, 'DeclareScenarioState');
    });

    it('should be captured without annotations', () => {
      interpret('Scenario: First scenario');

      const exported = machine.build();
      eq(exported.scenarios.length, 1);
      eq(exported.scenarios[0].title, 'First scenario');
      eq(exported.annotations.length, 0);
    });

    it('should be captured with annotations', () => {
      interpret('@one=1');
      interpret('@two=2');
      interpret('Scenario: First scenario');

      const exported = machine.build();
      eq(exported.scenarios.length, 1);
      eq(exported.scenarios[0].annotations.length, 2);
      deq(exported.scenarios[0].annotations[0], { name: 'one', value: '1' });
      deq(exported.scenarios[0].annotations[1], { name: 'two', value: '2' });
    });
  });

  describe('A line of text', () => {
    it('should not cause a state transition', () => {
      interpret('some text');
      eq(machine.state, 'DeclareFeatureState');
    });

    it('should be captured in the feature description', () => {
      interpret('some text');
      interpret('some more text');
      interpret('   some indented text');

      const exported = machine.build();
      eq(exported.description, 'some text\nsome more text\n   some indented text');
    });
  });

  function interpret(line, number = 1, indentation = utils.getIndentation(line)) {
    machine.interpret({ line, number, indentation });
  }
});
