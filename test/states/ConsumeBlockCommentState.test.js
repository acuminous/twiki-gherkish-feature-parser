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

  describe('Annotation Events', () => {
    it('should not cause transition', () => {
      handle('@foo = bar');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  describe('Background Events', () => {
    it('should not cause transition', () => {
      handle('Background: foo');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  describe('Blank Line Events', () => {
    it('should not cause transition', () => {
      handle('');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  describe('DocString Indent Start Events', () => {
    it('should not cause transition', () => {
      session.indentation = 0;
      handle('   some text');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  describe('DocString Indent Stop Events', () => {
    it('should not cause transition', () => {
      session.docString = { indentation: 3 };
      session.indentation = 0;
      handle('some text');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  describe('DocString Token Start Events', () => {
    it('should not cause transition', () => {
      handle('---');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  describe('DocString Token Stop Events', () => {
    it('should not cause transition', () => {
      session.docString = { token: '---' };
      handle('---');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  describe('End Events', () => {
    it('should error', () => {
      throws(() => handle('\u0000'), { message: `I did not expect the end of the feature at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('Feature Events', () => {
    it('should not cause transition', () => {
      handle('Feature: foo');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  describe('Block Comment Events', () => {
    it('should transition to previous state', () => {
      handle('###');
      eq(machine.state, 'CreateFeatureState');
    });
  });

  describe('Scenario Events', () => {
    it('should not cause transition', () => {
      handle('Scenario: foo');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  describe('Single Line Comment Events', () => {
    it('should not cause transition', () => {
      handle('# Single comment');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  describe('Step Events', () => {
    it('should not cause transition', () => {
      handle('Given some text');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  describe('Text Events', () => {
    it('should not cause transition', () => {
      handle('some text');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  function handle(line, number = 1) {
    state.handle({ line, number }, session);
  }
});
