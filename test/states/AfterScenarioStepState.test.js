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
    ' - An annotation',
    ' - A blank line',
    ' - A block comment',
    ' - The start of an explicit DocString',
    ' - The start of an indented DocString',
    ' - The end of the feature',
    ' - A scenario',
    ' - A single line comment',
    ' - A step',
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

  describe('Annotation Events', () => {
    it('should not cause transition', () => {
      handle('@foo=bar');
      eq(machine.state, 'AfterScenarioStepState');
    });
  });

  describe('Background Events', () => {
    it('should error', () => {
      throws(() => handle('Background: Meh'), { message: `'Background: Meh' was unexpected at undefined:1\nExpected one of:\n${expectedEvents}\n` });
    });
  });

  describe('Blank Line Events', () => {
    it('should not cause transition', () => {
      handle('');
      eq(machine.state, 'AfterScenarioStepState');
    });
  });

  describe('DocString Indent Start Events', () => {
    it('should transition to new CreateScenarioStepDocStringState on DocStringIndentStart event', () => {
      session.indentation = 0;
      handle('   Some text');
      eq(machine.state, 'CreateScenarioStepDocStringState');
    });

    it('should capture DocStrings', () => {
      session.indentation = 0;
      handle('   Some text');

      const exported = featureBuilder.build();
      eq(exported.scenarios[0].steps[0].docString, 'Some text');
    });
  });

  describe('DocString Indent Stop Events', () => {
    it('should error on DocStringIndentStop event', () => {
      session.docString = { indentation: 3 };
      session.indentation = 0;
      throws(() => handle('Some text'), { message: `'Some text' was unexpected at undefined:1\nExpected one of:\n${expectedEvents}\n` });
    });
  });

  describe('DocString Token Start Events', () => {
    it('should transition to new CreateScenarioStepDocStringState on DocStringTokenStart event', () => {
      handle('---');
      eq(machine.state, 'CreateScenarioStepDocStringState');
    });
  });

  describe('DocString Token Stop Events', () => {
    it('should error on DocStringTokenStop event', () => {
      session.docString = { token: '---' };
      throws(() => handle('---'), { message: `'---' was unexpected at undefined:1\nExpected one of:\n${expectedEvents}\n` });
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
      throws(() => handle('Feature: Meh'), { message: `'Feature: Meh' was unexpected at undefined:1\nExpected one of:\n${expectedEvents}\n` });
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
      eq(machine.state, 'AfterScenarioStepState');
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
