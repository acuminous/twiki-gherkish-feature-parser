import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, States, Languages, utils } from '../../lib/index.js';

const { describe, it, xdescribe, xit, before, beforeEach, after, afterEach } = zunit;
const { AfterBackgroundStepState } = States;

describe('AfterBackgroundStepState', () => {
  let featureBuilder;
  let machine;
  let state;
  let session;

  beforeEach(() => {
    featureBuilder = new FeatureBuilder();
    featureBuilder.createFeature({ annotations: [], title: 'Meh' });
    featureBuilder.createBackground({ annotations: [], title: 'Meh' });
    featureBuilder.createBackgroundStep({ annotations: [], text: 'Meh' });

    machine = new StateMachine({ featureBuilder });
    machine.toAfterBackgroundStepState();

    state = new AfterBackgroundStepState({ featureBuilder, machine });

    session = { language: Languages.English };
  });

  describe('Annotation Events', () => {
    it('should not cause transition', () => {
      handle('@foo=bar');
      eq(machine.state, 'AfterBackgroundStepState');
    });
  });

  describe('Background Events', () => {
    it('should error', () => {
      throws(() => handle('Background: foo'), { message: "'Background: foo' was unexpected in state: AfterBackgroundStepState on line 1'" });
    });
  });

  describe('Blank Line Events', () => {
    it('should not cause transition', () => {
      handle('');
      eq(machine.state, 'AfterBackgroundStepState');
    });
  });

  describe('DocString Indent Start Events', () => {
    it('should transition to new CreateBackgroundStepDocStringState on DocStringIndentStart event', () => {
      session.indentation = 0;
      handle('   Some text');
      eq(machine.state, 'CreateBackgroundStepDocStringState');
    });

    it('should capture DocStrings', () => {
      session.indentation = 0;
      handle('   Some text');

      const exported = featureBuilder.build();
      eq(exported.background.steps[0].docString, 'Some text');
    });
  });

  describe('DocString Indent Stop Events', () => {
    it('should error on DocStringIndentStop event', () => {
      session.docString = { indentation: 3 };
      session.indentation = 0;
      throws(() => handle('Some text'), { message: "'Some text' was unexpected in state: AfterBackgroundStepState on line 1'" });
    });
  });

  describe('DocString Token Start Events', () => {
    it('should transition to new CreateBackgroundStepDocStringState on DocStringTokenStart event', () => {
      handle('---');
      eq(machine.state, 'CreateBackgroundStepDocStringState');
    });
  });

  describe('DocString Token Stop Events', () => {
    it('should error on DocStringTokenStop event', () => {
      session.docString = { token: '---' };
      throws(() => handle('---'), { message: "'---' was unexpected in state: AfterBackgroundStepState on line 1'" });
    });
  });

  describe('End Events', () => {
    it('should transition to final on end event', () => {
      throws(() => handle('\u0000'), { message: 'Premature end of feature in state: AfterBackgroundStepState on line 1' });
    });
  });

  describe('Feature Events', () => {
    it('should error on feature event', () => {
      throws(() => handle('Feature: foo'), { message: "'Feature: foo' was unexpected in state: AfterBackgroundStepState on line 1'" });
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
      handle('Scenario: First scenario');

      const exported = featureBuilder.build();
      eq(exported.scenarios.length, 1);
      eq(exported.scenarios[0].title, 'First scenario');
    });

    it('should capture scenarios with annotations', () => {
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

  describe('Single Line Comment Events', () => {
    it('should not cause transition', () => {
      handle('# foo');
      eq(machine.state, 'AfterBackgroundStepState');
    });
  });

  describe('Step Events', () => {
    it('should transition to new AfterBackgroundStepState on step event', () => {
      handle('Given some text');
      eq(machine.state, 'AfterBackgroundStepState');
    });

    it('should capture step', () => {
      handle('Given some text');

      const exported = featureBuilder.build();
      eq(exported.background.steps.length, 2);
      eq(exported.background.steps[1].text, 'Given some text');
    });

    it('should capture steps with annotations', () => {
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

  function handle(line, number = 1, indentation = utils.getIndentation(line)) {
    state.handle({ line, number, indentation }, session);
  }
});
