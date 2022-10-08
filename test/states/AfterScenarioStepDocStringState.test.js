import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, States, Languages, utils } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { AfterScenarioStepDocStringState } = States;

describe('AfterScenarioStepDocStringState', () => {
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
  ].join('\n');

  beforeEach(() => {
    featureBuilder = new FeatureBuilder();
    featureBuilder.createFeature({ annotations: [], title: 'Some feature' });
    featureBuilder.createScenario({ annotations: [], title: 'First scenario' });
    featureBuilder.createScenarioStep({ annotations: [], text: 'First step' });

    machine = new StateMachine({ featureBuilder });
    machine.toAfterScenarioStepDocStringState();
    state = new AfterScenarioStepDocStringState({ featureBuilder, machine });

    session = { language: Languages.English };
  });

  describe('Annotation Events', () => {
    it('should not cause transition', () => {
      handle('@foo=bar');
      eq(machine.state, 'AfterScenarioStepDocStringState');
    });
  });

  describe('Background Events', () => {
    it('should error', () => {
      throws(() => handle('Background: Meh'), { message: `I did not expect a background at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('Blank Line Events', () => {
    it('should not cause transition', () => {
      handle('');
      eq(machine.state, 'AfterScenarioStepDocStringState');
    });
  });

  describe('DocString Indent Start Events', () => {
    it('should error on docstringIndentStart event', () => {
      session.indentation = 0;
      throws(() => handle('   some text'), { message: `I did not expect the start of an indented docstring at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('DocString Indent Stop Events', () => {
    it('should error on docstringIndentStop event', () => {
      session.docString = { indentation: 3 };
      session.indentation = 0;
      throws(() => handle('some text'), { message: `I did not expect the end of an indented docstring at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('DocString Token Start Events', () => {
    it('should error on docstringTokenStart event', () => {
      throws(() => handle('---'), { message: `I did not expect the start of an explicit docstring at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('DocString Token Stop Events', () => {
    it('should error on docstringTokenStop event', () => {
      session.docString = { token: '---' };
      throws(() => handle('---'), { message: `I did not expect the end of an explicit docstring at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('Feature Events', () => {
    it('should error on feature event', () => {
      throws(() => handle('Feature: foo'), { message: `I did not expect a feature at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('End Events', () => {
    it('should transition to final on end event', () => {
      handle('\u0000');
      eq(machine.state, 'FinalState');
    });
  });

  describe('Feature Events', () => {
    it('should error', () => {
      throws(() => handle('Feature: Meh'), { message: `I did not expect a feature at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('Block Comment Events', () => {
    it('should transition to ConsumeBlockCommentState', () => {
      handle('###');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  describe('Scenario Events', () => {
    it('should transition to CreateScenarioState on scenario event', () => {
      handle('Scenario: foo');
      eq(machine.state, 'CreateScenarioState');
    });

    it('should capture scenarios', () => {
      handle('Scenario: Second scenario');

      const exported = featureBuilder.build();
      eq(exported.scenarios.length, 2);
      eq(exported.scenarios[0].title, 'First scenario');
      eq(exported.scenarios[1].title, 'Second scenario');
    });

    it('should capture scenarios with annotations', () => {
      handle('@one=1');
      handle('@two=2');
      handle('Scenario: Second scenario');

      const exported = featureBuilder.build();
      eq(exported.scenarios.length, 2);
      eq(exported.scenarios[1].annotations.length, 2);
      eq(exported.scenarios[1].annotations[0].name, 'one');
      eq(exported.scenarios[1].annotations[0].value, '1');
      eq(exported.scenarios[1].annotations[1].name, 'two');
      eq(exported.scenarios[1].annotations[1].value, '2');
    });
  });

  describe('Single Line Comment Events', () => {
    it('should not cause transition', () => {
      handle('#');
      eq(machine.state, 'AfterScenarioStepDocStringState');
    });
  });

  describe('Step Events', () => {
    it('should transition to AfterScenarioStepState on step event', () => {
      handle('Second step');
      eq(machine.state, 'AfterScenarioStepState');
    });

    it('should capture step', () => {
      handle('Second step');

      const exported = featureBuilder.build();
      eq(exported.scenarios[0].steps.length, 2);
      eq(exported.scenarios[0].steps[0].text, 'First step');
      eq(exported.scenarios[0].steps[1].text, 'Second step');
    });

    it('should capture steps with annotations', () => {
      handle('@one=1');
      handle('@two=2');
      handle('Bah');

      const exported = featureBuilder.build();
      eq(exported.scenarios[0].steps[1].annotations.length, 2);
      eq(exported.scenarios[0].steps[1].annotations[0].name, 'one');
      eq(exported.scenarios[0].steps[1].annotations[0].value, '1');
      eq(exported.scenarios[0].steps[1].annotations[1].name, 'two');
      eq(exported.scenarios[0].steps[1].annotations[1].value, '2');
    });
  });

  function handle(line, number = 1, indentation = utils.getIndentation(line)) {
    state.handle({ line, number, indentation }, session);
  }
});
