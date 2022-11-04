import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, utils } from '../../lib/index.js';
import StubSession from '../stubs/StubSession.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('DeclareBackgroundState', () => {
  let featureBuilder;
  let machine;
  const expectedEvents = [
    ' - a blank line',
    ' - a block comment delimiter',
    ' - a single line comment',
    ' - a step',
    ' - an annotation',
  ].join('\n');

  beforeEach(() => {
    featureBuilder = new FeatureBuilder()
      .createFeature({ title: 'Meh' })
      .createBackground({ title: 'Meh' });

    const session = new StubSession();

    machine = new StateMachine({ featureBuilder, session })
      .toDeclareFeatureState()
      .checkpoint()
      .toDeclareBackgroundState();
  });

  describe('Annotations', () => {
    it('should cause a transition to CaptureAnnotationState', () => {
      interpret('@foo=bar');
      eq(machine.state, 'CaptureAnnotationState');
    });
  });

  describe('Backgrounds', () => {
    it('should be unexpected', () => {
      throws(() => interpret('Background: foo'), { message: `I did not expect a background at index.js:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('Blank lines', () => {
    it('should not cause a state transition', () => {
      interpret('');
      eq(machine.state, 'DeclareBackgroundState');
    });
  });

  describe('Block comment delimiters', () => {
    it('should cause a transition to BlockCommentState', () => {
      interpret('###');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  describe('Example tables', () => {
    it('should be unexpected', () => {
      throws(() => interpret('Where:'), { message: `I did not expect an example table at index.js:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('Explicit docstring delimiters', () => {
    it('should be unexpected', () => {
      throws(() => interpret('---'), { message: `I did not expect the start of an explicit docstring at index.js:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('Implicit docstring delimiters', () => {
    it('should be unexpected', () => {
      throws(() => interpret('   some docstring'), { message: `I did not expect the start of an implicit docstring at index.js:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('End of file', () => {
    it('should be unexpected', () => {
      throws(() => interpret('\u0000'), { message: `I did not expect the end of the feature at index.js:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('Features', () => {
    it('should be unexpected', () => {
      throws(() => interpret('Feature: foo'), { message: `I did not expect a feature at index.js:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('Single line comments', () => {
    it('should not cause a state transition', () => {
      interpret('# Some comment');
      eq(machine.state, 'DeclareBackgroundState');
    });
  });

  describe('Scenarios', () => {
    it('should be unexpected', () => {
      throws(() => interpret('Scenario: First scenario'), { message: `I did not expect a scenario at index.js:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('Lines of text', () => {
    it('should cause a transition to CaptureBackgroundStepState', () => {
      interpret('First step');
      eq(machine.state, 'CaptureBackgroundStepState');
    });

    it('should be captured without annotations', () => {
      interpret('First step');

      const exported = featureBuilder.build();
      eq(exported.background.steps.length, 1);
      eq(exported.background.steps[0].text, 'First step');
      eq(exported.background.steps[0].annotations.length, 0);
    });

    it('should be captured with annotations', () => {
      interpret('@one=1');
      interpret('@two=2');
      interpret('First step');

      const exported = featureBuilder.build();
      eq(exported.background.steps[0].annotations.length, 2);
      deq(exported.background.steps[0].annotations[0], { name: 'one', value: '1' });
      deq(exported.background.steps[0].annotations[1], { name: 'two', value: '2' });
    });
  });

  function interpret(line, number = 1, indentation = utils.getIndentation(line)) {
    machine.interpret({ line, number, indentation });
  }
});
