import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, States, Languages, utils } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { CreateBackgroundState } = States;

describe('CreateBackgroundState', () => {
  let featureBuilder;
  let machine;
  let state;
  let session;
  const expectedEvents = [
    ' - a blank line',
    ' - a block comment',
    ' - a single line comment',
    ' - a step',
    ' - an annotation',
  ].join('\n');

  beforeEach(() => {
    featureBuilder = new FeatureBuilder();
    featureBuilder.createFeature({ annotations: [], title: 'Meh' });

    machine = new StateMachine({ featureBuilder });
    machine.toCreateBackgroundState({ featureBuilder });

    state = new CreateBackgroundState({ machine, featureBuilder });

    session = { language: Languages.English };
  });

  describe('An annotation', () => {
    it('should not cause a state transition', () => {
      handle('@foo=bar');
      eq(machine.state, 'CreateBackgroundState');
    });
  });

  describe('A background', () => {
    it('should be unexpected', () => {
      throws(() => handle('Background: foo'), { message: `I did not expect a background at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('A blank line', () => {
    it('should not cause a state transition', () => {
      handle('');
      eq(machine.state, 'CreateBackgroundState');
    });
  });

  describe('An indented blank line', () => {
    it('should be unexpected', () => {
      session.indentation = 0;
      throws(() => handle('   some text'), { message: `I did not expect the start of an indented docstring at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('DocString Indent Stop Events', () => {
    it('should be unexpected', () => {
      session.docstring = { indentation: 3 };
      session.indentation = 0;
      throws(() => handle('some text'), { message: `I did not expect the end of an indented docstring at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('A docstring token', () => {
    it('should be unexpected', () => {
      throws(() => handle('---'), { message: `I did not expect the start of an explicit docstring at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('DocString Token Stop Events', () => {
    it('should be unexpected', () => {
      session.docstring = { token: '---' };
      throws(() => handle('---'), { message: `I did not expect the end of an explicit docstring at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('The end of the feature', () => {
    it('should be unexpected', () => {
      throws(() => handle('\u0000'), { message: `I did not expect the end of the feature at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('A feature', () => {
    it('should be unexpected', () => {
      throws(() => handle('Feature: foo'), { message: `I did not expect a feature at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('A block comment', () => {
    it('should cause a transition to ConsumeBlockCommentState', () => {
      handle('###');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  describe('A scenario', () => {
    it('should be unexpected', () => {
      throws(() => handle('Scenario: First scenario'), { message: `I did not expect a scenario at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('A single line comment', () => {
    it('should not cause a state transition', () => {
      handle('# Some comment');
      eq(machine.state, 'CreateBackgroundState');
    });
  });

  describe('A line of text', () => {
    it('should cause a transition to AfterBackgroundStepState', () => {
      featureBuilder.createBackground({ annotations: [] });

      handle('First step');

      eq(machine.state, 'AfterBackgroundStepState');
    });

    it('should be captureds', () => {
      featureBuilder.createBackground({ annotations: [] });

      handle('First step');

      const exported = featureBuilder.build();
      eq(exported.background.steps.length, 1);
      eq(exported.background.steps[0].text, 'First step');
    });

    it('should be captureds with annotations', () => {
      featureBuilder.createBackground({ annotations: [] });

      handle('@one=1');
      handle('@two=2');
      handle('First step');

      const exported = featureBuilder.build();
      eq(exported.background.steps[0].annotations.length, 2);
      eq(exported.background.steps[0].annotations[0].name, 'one');
      eq(exported.background.steps[0].annotations[0].value, '1');
      eq(exported.background.steps[0].annotations[1].name, 'two');
      eq(exported.background.steps[0].annotations[1].value, '2');
    });
  });

  function handle(line, number = 1, indentation = utils.getIndentation(line)) {
    state.handle({ line, number, indentation }, session);
  }
});
