import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, States, Languages, utils } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { AfterBackgroundStepState } = States;

describe('AfterBackgroundStepState', () => {
  let featureBuilder;
  let machine;
  let state;
  let session;
  const expectedEvents = [
    ' - a blank line',
    ' - a block comment',
    ' - a scenario',
    ' - a single line comment',
    ' - a step',
    ' - an annotation',
    ' - the start of an explicit docstring',
    ' - the start of an indented docstring',
  ].join('\n');

  beforeEach(() => {
    featureBuilder = new FeatureBuilder();
    featureBuilder.createFeature({ annotations: [], title: 'Meh' });
    featureBuilder.createBackground({ annotations: [], title: 'Meh' });
    featureBuilder.createBackgroundStep({ annotations: [], text: 'Meh' });

    machine = new StateMachine({ featureBuilder });
    machine.toAfterBackgroundStepState();

    state = new AfterBackgroundStepState({ featureBuilder, machine });

    session = { language: Languages.English, indentation: 0 };
  });

  describe('An annotation', () => {
    it('should not cause a state transition', () => {
      handle('@foo=bar');
      eq(machine.state, 'AfterBackgroundStepState');
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
      eq(machine.state, 'AfterBackgroundStepState');
    });
  });

  describe('A docstring token', () => {
    it('should cause a transition to CreateBackgroundStepExplicitDocStringState', () => {
      handle('---');
      eq(machine.state, 'CreateBackgroundStepExplicitDocStringState');
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
    it('should cause a transition to CreateScenarioState', () => {
      handle('Scenario: foo');
      eq(machine.state, 'CreateScenarioState');
    });

    it('should be captured', () => {
      handle('Scenario: First scenario');

      const exported = featureBuilder.build();
      eq(exported.scenarios.length, 1);
      eq(exported.scenarios[0].title, 'First scenario');
    });

    it('should be captured with annotations', () => {
      handle('@one = 1');
      handle('@two = 2');
      handle('Scenario: First scenario');

      const exported = featureBuilder.build();
      eq(exported.scenarios.length, 1);
      eq(exported.scenarios[0].annotations.length, 2);
      eq(exported.scenarios[0].annotations[0].name, 'one');
      eq(exported.scenarios[0].annotations[0].value, '1');
      eq(exported.scenarios[0].annotations[1].name, 'two');
      eq(exported.scenarios[0].annotations[1].value, '2');
    });
  });

  describe('A single line comment', () => {
    it('should not cause a state transition', () => {
      handle('# foo');
      eq(machine.state, 'AfterBackgroundStepState');
    });
  });

  describe('A line of text', () => {
    it('should cause a transition to AfterBackgroundStepState', () => {
      handle('Given some text');
      eq(machine.state, 'AfterBackgroundStepState');
    });

    it('should be captured', () => {
      handle('Given some text');

      const exported = featureBuilder.build();
      eq(exported.background.steps.length, 2);
      eq(exported.background.steps[1].text, 'Given some text');
    });

    it('should be captureds with annotations', () => {
      handle('@one = 1');
      handle('@two = 2');
      handle('Given some text');

      const exported = featureBuilder.build();
      eq(exported.background.steps[1].annotations.length, 2);
      eq(exported.background.steps[1].annotations[0].name, 'one');
      eq(exported.background.steps[1].annotations[0].value, '1');
      eq(exported.background.steps[1].annotations[1].name, 'two');
      eq(exported.background.steps[1].annotations[1].value, '2');
    });
  });

  describe('An indented line of text', () => {
    it('should cause a transition to CreateBackgroundStepImplicitDocStringState', () => {
      handle('   some text');
      eq(machine.state, 'CreateBackgroundStepImplicitDocStringState');
    });

    it('should be captured on the docstring', () => {
      handle('   some text');
      const exported = featureBuilder.build();
      eq(exported.background.steps[0].docstring, 'some text');
    });
  });

  function handle(line, number = 1, indentation = utils.getIndentation(line)) {
    state.handle({ line, number, indentation }, session);
  }
});
