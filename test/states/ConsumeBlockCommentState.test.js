import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, States, Languages } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { ConsumeBlockCommentState } = States;

describe('ConsumeBlockCommentState', () => {
  let machine;
  let state;
  let session;
  const expectedEvents = [
    ' - a block comment',
    ' - some text',
  ].join('\n');

  beforeEach(() => {
    const featureBuilder = new FeatureBuilder();

    machine = new StateMachine({ featureBuilder });
    machine.toCreateFeatureState();
    machine.toConsumeBlockCommentState();

    state = new ConsumeBlockCommentState({ featureBuilder, machine });

    session = { language: Languages.English };
  });

  describe('An annotation', () => {
    it('should not cause a state transition', () => {
      handle('@foo = bar');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  describe('A background', () => {
    it('should not cause a state transition', () => {
      handle('Background: foo');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  describe('A blank line', () => {
    it('should not cause a state transition', () => {
      handle('');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  describe('An indented blank line', () => {
    it('should not cause a state transition', () => {
      session.indentation = 0;
      handle('   some text');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  describe('DocString Indent Stop Events', () => {
    it('should not cause a state transition', () => {
      session.docstring = { indentation: 3 };
      session.indentation = 0;
      handle('some text');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  describe('A docstring token', () => {
    it('should not cause a state transition', () => {
      handle('---');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  describe('DocString Token Stop Events', () => {
    it('should not cause a state transition', () => {
      session.docstring = { token: '---' };
      handle('---');
      eq(machine.state, 'ConsumeBlockCommentState');
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
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  describe('A block comment', () => {
    it('should cause a state transition to previous state', () => {
      handle('###');
      eq(machine.state, 'CreateFeatureState');
    });
  });

  describe('A scenario', () => {
    it('should not cause a state transition', () => {
      handle('Scenario: foo');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  describe('A single line comment', () => {
    it('should not cause a state transition', () => {
      handle('# Single comment');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  describe('A line of text', () => {
    it('should not cause a state transition', () => {
      handle('Given some text');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  describe('Text Events', () => {
    it('should not cause a state transition', () => {
      handle('some text');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  function handle(line, number = 1) {
    state.handle({ line, number }, session);
  }
});
