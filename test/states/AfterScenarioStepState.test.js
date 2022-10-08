import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, States, Languages, utils } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { AfterScenarioStepState } = States;

describe('AfterScenarioStepState', () => {
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
    ' - the end of the feature',
    ' - the start of an explicit docstring',
    ' - the start of an indented docstring',
  ].join('\n');

  beforeEach(() => {
    featureBuilder = new FeatureBuilder();
    featureBuilder.createFeature({ annotations: [], title: 'Some feature' });
    featureBuilder.createScenario({ annotations: [], title: 'First scenario' });
    featureBuilder.createScenarioStep({ annotations: [], text: 'First step' });

    machine = new StateMachine({ featureBuilder });
    machine.toAfterScenarioStepState();

    state = new AfterScenarioStepState({ featureBuilder, machine });

    session = { language: Languages.English };
  });

  describe('An annotation', () => {
    it('should not cause a state transition', () => {
      handle('@foo=bar');
      eq(machine.state, 'AfterScenarioStepState');
    });
  });

  describe('A background', () => {
    it('should be unexpected', () => {
      throws(() => handle('Background: Meh'), { message: `I did not expect a background at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('A blank line', () => {
    it('should not cause a state transition', () => {
      handle('');
      eq(machine.state, 'AfterScenarioStepState');
    });
  });

  describe('An indented blank line', () => {
    it('should cause a state transition to CreateScenarioStepDocStringState', () => {
      session.indentation = 0;
      handle('   some text');
      eq(machine.state, 'CreateScenarioStepDocStringState');
    });

    it('should capture docstrings', () => {
      session.indentation = 0;
      handle('   some text');

      const exported = featureBuilder.build();
      eq(exported.scenarios[0].steps[0].docstring, 'some text');
    });
  });

  describe('DocString Indent Stop Events', () => {
    it('should be unexpected on docstringIndentStop event', () => {
      session.docstring = { indentation: 3 };
      session.indentation = 0;
      throws(() => handle('some text'), { message: `I did not expect the end of an indented docstring at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('A docstring token', () => {
    it('should cause a state transition to CreateScenarioStepDocStringState', () => {
      handle('---');
      eq(machine.state, 'CreateScenarioStepDocStringState');
    });
  });

  describe('DocString Token Stop Events', () => {
    it('should be unexpected on docstringTokenStop event', () => {
      session.docstring = { token: '---' };
      throws(() => handle('---'), { message: `I did not expect the end of an explicit docstring at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('The end of the feature', () => {
    it('should cause a state transition to final on end event', () => {
      handle('\u0000');
      eq(machine.state, 'FinalState');
    });
  });

  describe('A feature', () => {
    it('should be unexpected', () => {
      throws(() => handle('Feature: Meh'), { message: `I did not expect a feature at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('A block comment', () => {
    it('should cause a state transition to ConsumeBlockCommentState', () => {
      handle('###');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  describe('A scenario', () => {
    it('should cause a state transition to CreateScenarioState', () => {
      handle('Scenario: foo');
      eq(machine.state, 'CreateScenarioState');
    });

    it('should be captured', () => {
      handle('Scenario: Second scenario');

      const exported = featureBuilder.build();
      eq(exported.scenarios.length, 2);
      eq(exported.scenarios[0].title, 'First scenario');
      eq(exported.scenarios[1].title, 'Second scenario');
    });

    it('should be captured with annotations', () => {
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

  describe('A single line comment', () => {
    it('should not cause a state transition', () => {
      handle('#');
      eq(machine.state, 'AfterScenarioStepState');
    });
  });

  describe('A line of text', () => {
    it('should cause a state transition to AfterScenarioStepState', () => {
      handle('Second step');
      eq(machine.state, 'AfterScenarioStepState');
    });

    it('should be captured', () => {
      handle('Second step');

      const exported = featureBuilder.build();

      eq(exported.scenarios[0].steps.length, 2);
      eq(exported.scenarios[0].steps[0].text, 'First step');
      eq(exported.scenarios[0].steps[1].text, 'Second step');
    });

    it('should be captureds with annotations', () => {
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
