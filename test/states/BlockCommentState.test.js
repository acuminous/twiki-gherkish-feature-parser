import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, Languages } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('BlockCommentState', () => {
  let machine;
  let session;
  const expectedEvents = [
    ' - a block comment delimiter',
    ' - some text',
  ].join('\n');

  beforeEach(() => {
    const featureBuilder = new FeatureBuilder();

    machine = new StateMachine({ featureBuilder });
    machine.toFeatureState();
    machine.toBlockCommentState();

    session = { language: Languages.English, indentation: 0 };
  });

  describe('An annotation', () => {
    it('should not cause a state transition', () => {
      interpret('@foo = bar');
      eq(machine.state, 'BlockCommentState');
    });
  });

  describe('A background', () => {
    it('should not cause a state transition', () => {
      interpret('Background: foo');
      eq(machine.state, 'BlockCommentState');
    });
  });

  describe('A blank line', () => {
    it('should not cause a state transition', () => {
      interpret('');
      eq(machine.state, 'BlockCommentState');
    });
  });

  describe('An example table', () => {
    it('should not cause a state transition', () => {
      interpret('Where:');
      eq(machine.state, 'BlockCommentState');
    });
  });

  describe('An explicit docstring', () => {
    it('should not cause a state transition', () => {
      interpret('---');
      eq(machine.state, 'BlockCommentState');
    });
  });

  describe('An implicit docstring', () => {
    it('should not cause a state transition', () => {
      session.indentation = 0;
      interpret('   some text');
      eq(machine.state, 'BlockCommentState');
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
      eq(machine.state, 'BlockCommentState');
    });
  });

  describe('A block comment', () => {
    it('should cause a transition to the previous state', () => {
      interpret('###');
      eq(machine.state, 'FeatureState');
    });
  });

  describe('A single line comment', () => {
    it('should not cause a state transition', () => {
      interpret('# Single comment');
      eq(machine.state, 'BlockCommentState');
    });
  });

  describe('A scenario', () => {
    it('should not cause a state transition', () => {
      interpret('Scenario: foo');
      eq(machine.state, 'BlockCommentState');
    });
  });

  describe('A line of text', () => {
    it('should not cause a state transition', () => {
      interpret('Given some text');
      eq(machine.state, 'BlockCommentState');
    });
  });

  function interpret(line, number = 1) {
    machine.interpret({ line, number }, session);
  }
});
