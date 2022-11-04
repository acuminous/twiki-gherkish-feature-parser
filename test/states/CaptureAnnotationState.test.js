import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, utils } from '../../lib/index.js';
import StubSession from '../stubs/StubSession.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('CaptureAnnotationState', () => {
  let featureBuilder;
  let machine;

  const expectedEvents = [
    ' - a background',
    ' - a blank line',
    ' - a block comment delimiter',
    ' - a feature',
    ' - a scenario',
    ' - a single line comment',
    ' - a step',
    ' - an annotation',
  ].join('\n');

  beforeEach(() => {
    featureBuilder = new FeatureBuilder();
    const session = new StubSession();
    machine = new StateMachine({ featureBuilder, session });
  });

  describe('Annotations', () => {
    it('should not cause a state transition', () => {
      interpret('@foo=bar');
      eq(machine.state, 'CaptureAnnotationState');
    });
  });

  describe('Backgrounds', () => {
    it('should unwind and dispatch', () => {
      featureBuilder.createFeature({ title: 'Meh' });
      machine.toDeclareFeatureState().checkpoint().toCaptureAnnotationState();
      interpret('Background: Meh');
      eq(machine.state, 'DeclareBackgroundState');
    });
  });

  describe('Blank lines', () => {
    it('should not cause a state transition', () => {
      machine.checkpoint().toCaptureAnnotationState();
      interpret('');
      eq(machine.state, 'CaptureAnnotationState');
    });
  });

  describe('Block comment delimiters', () => {
    it('should cause a transition to BlockCommentState', () => {
      machine.checkpoint().toCaptureAnnotationState();
      interpret('###');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  describe('Example tables', () => {
    it('should be unexpected', () => {
      machine.toCaptureAnnotationState();
      throws(() => interpret('Where:'), { message: `I did not expect an example table at index.js:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('Explicit docstring delimiters', () => {
    it('should be unexpected', () => {
      machine.toCaptureAnnotationState();
      throws(() => interpret('---'), { message: `I did not expect the start of an explicit docstring at index.js:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('Implicit docstring delimiters', () => {
    it('should be unexpected', () => {
      machine.toCaptureAnnotationState();
      throws(() => interpret('   some docstring'), { message: `I did not expect the start of an implicit docstring at index.js:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('End of file', () => {
    it('should be unexpected', () => {
      machine.toCaptureAnnotationState();
      throws(() => interpret('\u0000'), { message: `I did not expect the end of the feature at index.js:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('Features', () => {
    it('should unwind and dispatch', () => {
      machine.checkpoint().toCaptureAnnotationState();
      interpret('Feature: Meh');
      eq(machine.state, 'DeclareFeatureState');
    });
  });

  describe('Single line comments', () => {
    it('should not cause a state transition', () => {
      machine.checkpoint().toCaptureAnnotationState();
      interpret('#');
      eq(machine.state, 'CaptureAnnotationState');
    });
  });

  describe('Scenarios', () => {
    it('should unwind and dispatch', () => {
      featureBuilder.createFeature({ title: 'Meh' }).createScenario({ title: 'Meh' });
      machine.toDeclareFeatureState().checkpoint().toCaptureAnnotationState();
      interpret('Scenario: Meh');
      eq(machine.state, 'DeclareScenarioState');
    });
  });

  describe('Lines of text', () => {
    it('should unwind and dispatch', () => {
      featureBuilder.createFeature({ title: 'Meh' }).createScenario({ title: 'Meh' });
      machine.toCaptureScenarioStepState().checkpoint().toCaptureAnnotationState();
      interpret('some text');
      eq(machine.state, 'CaptureScenarioStepState');
    });
  });

  function interpret(line, number = 1, indentation = utils.getIndentation(line)) {
    machine.interpret({ line, number, indentation });
  }
});
