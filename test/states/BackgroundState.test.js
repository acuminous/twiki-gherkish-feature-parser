import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, States, Languages, utils } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { BackgroundState } = States;

describe('BackgroundState', () => {
  let featureBuilder;
  let machine;
  let state;
  let session;
  const expectedEvents = [
    ' - a blank line',
    ' - a block comment delimiter',
    ' - a single line comment',
    ' - a step',
    ' - an annotation',
  ].join('\n');

  beforeEach(() => {
    featureBuilder = new FeatureBuilder();
    featureBuilder.createFeature({ annotations: [], title: 'Meh' });
    featureBuilder.createBackground({ annotations: [], title: 'Meh' });

    machine = new StateMachine({ featureBuilder });
    machine.toBackgroundState({ featureBuilder });

    state = new BackgroundState({ machine, featureBuilder });

    session = { language: Languages.English, indentation: 0 };
  });

  describe('An annotation', () => {
    it('should not cause a state transition', () => {
      interpret('@foo=bar');
      eq(machine.state, 'BackgroundState');
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
      eq(machine.state, 'BackgroundState');
    });
  });

  describe('A block comment delimiter', () => {
    it('should cause a transition to BlockCommentState', () => {
      interpret('###');
      eq(machine.state, 'BlockCommentState');
    });
  });

  describe('An example table', () => {
    it('should be unexpected', () => {
      throws(() => interpret('Where:'), { message: `I did not expect an example table at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('An explicit docstring', () => {
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
      eq(machine.state, 'BackgroundState');
    });
  });

  describe('A scenario', () => {
    it('should be unexpected', () => {
      throws(() => interpret('Scenario: First scenario'), { message: `I did not expect a scenario at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('A line of text', () => {
    it('should cause a transition to BackgroundStepsState', () => {
      featureBuilder.createBackground({ annotations: [] });

      interpret('First step');

      eq(machine.state, 'BackgroundStepsState');
    });

    it('should be captured without annotations', () => {
      interpret('First step');

      const exported = featureBuilder.build();
      eq(exported.background.steps.length, 1);
      eq(exported.background.steps[0].text, 'First step');
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
    state.interpret({ line, number, indentation }, session);
  }
});
