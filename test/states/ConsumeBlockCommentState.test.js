import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('ConsumeBlockCommentState', () => {
  let machine;
  const expectedEvents = [
    ' - a block comment delimiter',
    ' - some text',
  ].join('\n');

  beforeEach(() => {
    const featureBuilder = new FeatureBuilder();
    machine = new StateMachine({ featureBuilder }, true)
      .toDeclareFeatureState()
      .checkpoint()
      .toConsumeBlockCommentState();
  });

  describe('An annotation', () => {
    it('should not cause a state transition', () => {
      interpret('@foo = bar');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  describe('A background', () => {
    it('should not cause a state transition', () => {
      interpret('Background: foo');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  describe('A blank line', () => {
    it('should not cause a state transition', () => {
      interpret('');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  describe('An example table', () => {
    it('should not cause a state transition', () => {
      interpret('Where:');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  describe('An explicit docstring delimiter', () => {
    it('should not cause a state transition', () => {
      interpret('---');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  describe('An implicit docstring', () => {
    it('should not cause a state transition', () => {
      interpret('   some text');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  describe('The end of the feature', () => {
    it('should be unexpected', () => {
      throws(() => interpret('\u0000'), { message: `I did not expect the end of the feature at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('A feature', () => {
    it('should not cause a state transition', () => {
      interpret('Feature: foo');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  describe('A block comment delimiter', () => {
    it('should cause a transition to the previous state', () => {
      interpret('###');
      eq(machine.state, 'DeclareFeatureState');
    });
  });

  describe('A single line comment', () => {
    it('should not cause a state transition', () => {
      interpret('# Single comment');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  describe('A scenario', () => {
    it('should not cause a state transition', () => {
      interpret('Scenario: foo');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  describe('A line of text', () => {
    it('should not cause a state transition', () => {
      interpret('Given some text');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  function interpret(line, number = 1) {
    machine.interpret({ line, number });
  }
});
