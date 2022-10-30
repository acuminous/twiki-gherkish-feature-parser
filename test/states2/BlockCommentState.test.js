import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('BlockCommentState', () => {
  let machine;
  const expectedEvents = [
    ' - a block comment delimiter',
    ' - some text',
  ].join('\n');

  beforeEach(() => {
    const featureBuilder = new FeatureBuilder();
    machine = new StateMachine({ featureBuilder })
      .toFeatureState()
      .checkpoint()
      .toBlockCommentState();
  });

  describe('An annotation', () => {
    it('should not cause a state transition', () => {
      handle('@foo = bar');
      eq(machine.state, 'BlockCommentState');
    });
  });

  describe('A background', () => {
    it('should not cause a state transition', () => {
      handle('Background: foo');
      eq(machine.state, 'BlockCommentState');
    });
  });

  describe('A blank line', () => {
    it('should not cause a state transition', () => {
      handle('');
      eq(machine.state, 'BlockCommentState');
    });
  });

  describe('An example table', () => {
    it('should not cause a state transition', () => {
      handle('Where:');
      eq(machine.state, 'BlockCommentState');
    });
  });

  describe('An explicit docstring', () => {
    it('should not cause a state transition', () => {
      handle('---');
      eq(machine.state, 'BlockCommentState');
    });
  });

  describe('An implicit docstring', () => {
    it('should not cause a state transition', () => {
      handle('   some text');
      eq(machine.state, 'BlockCommentState');
    });
  });

  describe('The end of the feature', () => {
    it('should be unexpected', () => {
      throws(() => handle('\u0000'), { message: `I did not expect the end of the feature at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('A feature', () => {
    it('should not cause a state transition', () => {
      handle('Feature: foo');
      eq(machine.state, 'BlockCommentState');
    });
  });

  describe('A block comment', () => {
    it('should cause a transition to the previous state', () => {
      handle('###');
      eq(machine.state, 'FeatureState');
    });
  });

  describe('A single line comment', () => {
    it('should not cause a state transition', () => {
      handle('# Single comment');
      eq(machine.state, 'BlockCommentState');
    });
  });

  describe('A scenario', () => {
    it('should not cause a state transition', () => {
      handle('Scenario: foo');
      eq(machine.state, 'BlockCommentState');
    });
  });

  describe('A line of text', () => {
    it('should not cause a state transition', () => {
      handle('Given some text');
      eq(machine.state, 'BlockCommentState');
    });
  });

  function handle(line, number = 1) {
    machine.handle({ line, number });
  }
});
