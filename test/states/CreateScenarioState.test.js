import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, States, Languages, utils } from '../../lib/index.js';

const { describe, it, xdescribe, xit, before, beforeEach, after, afterEach } = zunit;
const { CreateScenarioState } = States;

describe('CreateScenarioState', () => {
  let featureBuilder;
  let machine;
  let state;
  let session;

  beforeEach(() => {
    featureBuilder = new FeatureBuilder();
    featureBuilder.createFeature({ annotations: [], title: 'Meh' });
    featureBuilder.createScenario({ annotations: [], title: 'Meh' });

    machine = new StateMachine({ featureBuilder });
    machine.toCreateScenarioState();

    state = new CreateScenarioState({ featureBuilder, machine });

    session = { language: Languages.English };
  });

  describe('Annotation Events', () => {
    it('should not cause transition', () => {
      handle('@foo=bar');
      eq(machine.state, 'CreateScenarioState');
    });
  });

  describe('Background Events', () => {
    it('should error', () => {
      throws(() => handle('Background: foo'), { message: "'Background: foo' was unexpected in state: CreateScenarioState on line undefined:1'" });
    });
  });

  describe('Blank Line Events', () => {
    it('should not cause transition', () => {
      handle('');
      eq(machine.state, 'CreateScenarioState');
    });
  });

  describe('DocString Indent Start Events', () => {
    it('should error on DocStringIndentStart event', () => {
      session.indentation = 0;
      throws(() => handle('   Some text'), { message: "'   Some text' was unexpected in state: CreateScenarioState on line undefined:1'" });
    });
  });

  describe('DocString Indent Stop Events', () => {
    it('should error on DocStringIndentStop event', () => {
      session.docString = { indentation: 3 };
      session.indentation = 0;
      throws(() => handle('Some text'), { message: "'Some text' was unexpected in state: CreateScenarioState on line undefined:1'" });
    });
  });

  describe('DocString Token Start Events', () => {
    it('should error on DocStringTokenStart event', () => {
      throws(() => handle('---'), { message: "'---' was unexpected in state: CreateScenarioState on line undefined:1'" });
    });
  });

  describe('DocString Token Stop Events', () => {
    it('should error on DocStringTokenStop event', () => {
      session.docString = { token: '---' };
      throws(() => handle('---'), { message: "'---' was unexpected in state: CreateScenarioState on line undefined:1'" });
    });
  });

  describe('End Events', () => {
    it('should error', () => {
      throws(() => handle('\u0000'), { message: 'Premature end of feature in state: CreateScenarioState on line undefined:1' });
    });
  });

  describe('Feature Events', () => {
    it('should error', () => {
      throws(() => handle('Feature: foo'), { message: "'Feature: foo' was unexpected in state: CreateScenarioState on line undefined:1'" });
    });
  });

  describe('Block Comment Events', () => {
    it('should transition to ConsumeBlockCommentState', () => {
      handle('###');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  describe('Scenario Events', () => {
    it('should error on scenario event', () => {
      throws(() => handle('Scenario: First scenario'), { message: "'Scenario: First scenario' was unexpected in state: CreateScenarioState on line undefined:1'" });
    });
  });

  describe('Single Line Comment Events', () => {
    it('should not cause transition', () => {
      handle('# Some comment');
      eq(machine.state, 'CreateScenarioState');
    });
  });

  describe('Step Events', () => {
    it('should transition to AfterScenarioStepState on step event', () => {
      handle('First step');
      eq(machine.state, 'AfterScenarioStepState');
    });

    it('should capture steps', () => {
      handle('First step');

      const exported = featureBuilder.build();
      eq(exported.scenarios[0].steps.length, 1);
      eq(exported.scenarios[0].steps[0].text, 'First step');
    });

    it('should capture steps with annotations', () => {
      handle('@one=1');
      handle('@two=2');
      handle('First step');

      const exported = featureBuilder.build();
      eq(exported.scenarios[0].steps[0].annotations.length, 2);
      eq(exported.scenarios[0].steps[0].annotations[0].name, 'one');
      eq(exported.scenarios[0].steps[0].annotations[0].value, '1');
      eq(exported.scenarios[0].steps[0].annotations[1].name, 'two');
      eq(exported.scenarios[0].steps[0].annotations[1].value, '2');
    });
  });

  function handle(line, number = 1, indentation = utils.getIndentation(line)) {
    state.handle({ line, number, indentation }, session);
  }
});
