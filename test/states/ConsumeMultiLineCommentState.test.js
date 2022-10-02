import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { Specification, StateMachine, States, Languages } from '../../lib/index.js';

const { describe, it, xdescribe, xit, before, beforeEach, after, afterEach } = zunit;
const { ConsumeMultiLineCommentState } = States;

describe('ConsumeMultiLineCommentState', () => {
  let machine;
  let state;
  let session;

  beforeEach(() => {
    const specification = new Specification();

    machine = new StateMachine({ specification });
    machine.toCreateFeatureState();
    machine.toConsumeMultiLineCommentState();

    state = new ConsumeMultiLineCommentState({ specification, machine });

    session = { language: Languages.utils.getDefault() };
  });

  describe('Annotation Events', () => {
    it('should not cause transition', () => {
      handle('@foo = bar');
      eq(machine.state, 'ConsumeMultiLineCommentState');
    });
  });

  describe('Background Events', () => {
    it('should not cause transition', () => {
      handle('Background: foo');
      eq(machine.state, 'ConsumeMultiLineCommentState');
    });
  });

  describe('Blank Line Events', () => {
    it('should not cause transition', () => {
      handle('');
      eq(machine.state, 'ConsumeMultiLineCommentState');
    });
  });

  describe('DocString Indent Start Events', () => {
    it('should not cause transition', () => {
      session.indentation = 0;
      handle('   Some text');
      eq(machine.state, 'ConsumeMultiLineCommentState');
    });
  });

  describe('DocString Indent Stop Events', () => {
    it('should not cause transition', () => {
      session.docString = { indentation: 3 };
      session.indentation = 0;
      handle('Some text');
      eq(machine.state, 'ConsumeMultiLineCommentState');
    });
  });

  describe('DocString Token Start Events', () => {
    it('should not cause transition', () => {
      handle('---');
      eq(machine.state, 'ConsumeMultiLineCommentState');
    });
  });

  describe('DocString Token Stop Events', () => {
    it('should not cause transition', () => {
      session.docString = { token: '---' };
      handle('---');
      eq(machine.state, 'ConsumeMultiLineCommentState');
    });
  });

  describe('End Events', () => {
    it('should error', () => {
      throws(() => handle('\u0000'), { message: 'Premature end of specification in state: ConsumeMultiLineCommentState on line 1' });
    });
  });

  describe('Feature Events', () => {
    it('should not cause transition', () => {
      handle('Feature: foo');
      eq(machine.state, 'ConsumeMultiLineCommentState');
    });
  });

  describe('Language Events', () => {
    it('should not cause transition', () => {
      handle('# Language: English');
      eq(machine.state, 'ConsumeMultiLineCommentState');
    });
  });

  describe('Multi Line Comment Events', () => {
    it('should transition to previous state', () => {
      handle('###');
      eq(machine.state, 'CreateFeatureState');
    });
  });

  describe('Scenario Events', () => {
    it('should not cause transition', () => {
      handle('Scenario: foo');
      eq(machine.state, 'ConsumeMultiLineCommentState');
    });
  });

  describe('Single Line Comment Events', () => {
    it('should not cause transition', () => {
      handle('# Single comment');
      eq(machine.state, 'ConsumeMultiLineCommentState');
    });
  });

  describe('Step Events', () => {
    it('should not cause transition', () => {
      handle('Given some text');
      eq(machine.state, 'ConsumeMultiLineCommentState');
    });
  });

  describe('Text Events', () => {
    it('should not cause transition', () => {
      handle('Some text');
      eq(machine.state, 'ConsumeMultiLineCommentState');
    });
  });

  function handle(line, number = 1) {
    state.handle({ line, number }, session);
  }
});
