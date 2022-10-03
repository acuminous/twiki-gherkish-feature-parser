import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { SpecificationParser, Specification, StateMachine, States, Languages } from '../../lib/index.js';

const { describe, it, xdescribe, xit, before, beforeEach, after, afterEach } = zunit;
const { AfterScenarioStepDocStringState } = States;

describe('AfterScenarioStepDocStringState', () => {
  let specification;
  let machine;
  let state;
  let session;

  beforeEach(() => {
    specification = new Specification();
    specification.createFeature({ annotations: [], title: 'Some feature' });
    specification.createScenario({ annotations: [], title: 'First scenario' });
    specification.createScenarioStep({ annotations: [], text: 'First step' });

    machine = new StateMachine({ specification });
    machine.toAfterScenarioStepDocStringState();
    state = new AfterScenarioStepDocStringState({ specification, machine });

    session = { language: Languages.None };
  });

  describe('Annotation Events', () => {
    it('should not cause transition', () => {
      handle('@foo=bar');
      eq(machine.state, 'AfterScenarioStepDocStringState');
    });
  });

  describe('Background Events', () => {
    it('should error', () => {
      throws(() => handle('Background: Meh'), { message: "'Background: Meh' was unexpected in state: AfterScenarioStepDocStringState on line 1'" });
    });
  });

  describe('Blank Line Events', () => {
    it('should not cause transition', () => {
      handle('');
      eq(machine.state, 'AfterScenarioStepDocStringState');
    });
  });

  describe('DocString Indent Start Events', () => {
    it('should error on DocStringIndentStart event', () => {
      session.indentation = 0;
      throws(() => handle('   Some text'), { message: "'   Some text' was unexpected in state: AfterScenarioStepDocStringState on line 1'" });
    });
  });

  describe('DocString Indent Stop Events', () => {
    it('should error on DocStringIndentStop event', () => {
      session.docString = { indentation: 3 };
      session.indentation = 0;
      throws(() => handle('Some text'), { message: "'Some text' was unexpected in state: AfterScenarioStepDocStringState on line 1'" });
    });
  });

  describe('DocString Token Start Events', () => {
    it('should error on DocStringTokenStart event', () => {
      throws(() => handle('---'), { message: "'---' was unexpected in state: AfterScenarioStepDocStringState on line 1'" });
    });
  });

  describe('DocString Token Stop Events', () => {
    it('should error on DocStringTokenStop event', () => {
      session.docString = { token: '---' };
      throws(() => handle('---'), { message: "'---' was unexpected in state: AfterScenarioStepDocStringState on line 1'" });
    });
  });

  describe('Feature Events', () => {
    it('should error on feature event', () => {
      throws(() => handle('Feature: foo'), { message: "'Feature: foo' was unexpected in state: AfterScenarioStepDocStringState on line 1'" });
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
      throws(() => handle('Feature: Meh'), { message: "'Feature: Meh' was unexpected in state: AfterScenarioStepDocStringState on line 1'" });
    });
  });

  describe('Multi Line Comment Events', () => {
    it('should transition to ConsumeMultiLineCommentState', () => {
      handle('###');
      eq(machine.state, 'ConsumeMultiLineCommentState');
    });
  });

  describe('Scenario Events', () => {
    it('should transition to CreateScenarioState on scenario event', () => {
      handle('Scenario: foo');
      eq(machine.state, 'CreateScenarioState');
    });

    it('should capture scenarios', () => {
      handle('Scenario: Second scenario');

      const exported = specification.serialise();
      eq(exported.scenarios.length, 2);
      eq(exported.scenarios[0].title, 'First scenario');
      eq(exported.scenarios[1].title, 'Second scenario');
    });

    it('should capture scenarios with annotations', () => {
      handle('@one=1');
      handle('@two=2');
      handle('Scenario: Second scenario');

      const exported = specification.serialise();
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

      const exported = specification.serialise();
      eq(exported.scenarios[0].steps.length, 2);
      eq(exported.scenarios[0].steps[0].text, 'First step');
      eq(exported.scenarios[0].steps[1].text, 'Second step');
      eq(exported.scenarios[0].steps[1].generalised, 'Second step');
    });

    it('should capture steps with annotations', () => {
      handle('@one=1');
      handle('@two=2');
      handle('Bah');

      const exported = specification.serialise();
      eq(exported.scenarios[0].steps[1].annotations.length, 2);
      eq(exported.scenarios[0].steps[1].annotations[0].name, 'one');
      eq(exported.scenarios[0].steps[1].annotations[0].value, '1');
      eq(exported.scenarios[0].steps[1].annotations[1].name, 'two');
      eq(exported.scenarios[0].steps[1].annotations[1].value, '2');
    });
  });

  function handle(line, number = 1, indentation = SpecificationParser.getIndentation(line)) {
    state.handle({ line, number, indentation }, session);
  }
});
