import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { SpecificationParser, Specification, StateMachine, States, Languages } from '../../lib/index.js';

const { describe, it, xdescribe, xit, before, beforeEach, after, afterEach } = zunit;
const { CreateFeatureState } = States;

describe('CreateFeatureState', () => {
  let specification;
  let machine;
  let state;
  let session;

  beforeEach(() => {
    specification = new Specification();
    specification.createFeature({ annotations: [], title: 'Meh' });

    machine = new StateMachine({ specification });
    machine.toCreateFeatureState();

    state = new CreateFeatureState({ specification, machine });

    session = { language: Languages.utils.getDefault() };
  });

  describe('Annotation Events', () => {
    it('should not cause transition', () => {
      handle('@foo=bar');
      eq(machine.state, 'CreateFeatureState');
    });
  });

  describe('Background Events', () => {
    it('should transition to CreateBackgroundState on background event', () => {
      handle('Background: foo');
      eq(machine.state, 'CreateBackgroundState');
    });

    it('should capture backgrounds with annotations', () => {
      handle('@one=1');
      handle('@two=2');
      handle('Background: First background');

      const exported = specification.serialise();
      eq(exported.background.annotations.length, 2);
      eq(exported.background.annotations[0].name, 'one');
      eq(exported.background.annotations[0].value, '1');
      eq(exported.background.annotations[1].name, 'two');
      eq(exported.background.annotations[1].value, '2');
    });
  });

  describe('Blank Line Events', () => {
    it('should not cause transition', () => {
      handle('');
      eq(machine.state, 'CreateFeatureState');
    });
  });

  describe('DocString Indent Start Events', () => {
    it('should error on DocStringIndentStart event', () => {
      session.indentation = 0;
      throws(() => handle('   Some text'), { message: "'   Some text' was unexpected in state: CreateFeatureState on line 1'" });
    });
  });

  describe('DocString Indent Stop Events', () => {
    it('should error on DocStringIndentStop event', () => {
      session.docString = { indentation: 3 };
      session.indentation = 0;
      throws(() => handle('Some text'), { message: "'Some text' was unexpected in state: CreateFeatureState on line 1'" });
    });
  });

  describe('DocString Token Start Events', () => {
    it('should error on DocStringTokenStart event', () => {
      throws(() => handle('---'), { message: "'---' was unexpected in state: CreateFeatureState on line 1'" });
    });
  });

  describe('DocString Token Stop Events', () => {
    it('should error on DocStringTokenStop event', () => {
      session.docString = { token: '---' };
      throws(() => handle('---'), { message: "'---' was unexpected in state: CreateFeatureState on line 1'" });
    });
  });

  describe('End Events', () => {
    it('should error', () => {
      throws(() => handle('\u0000'), { message: 'Premature end of specification in state: CreateFeatureState on line 1' });
    });
  });

  describe('Feature Events', () => {
    it('should error', () => {
      throws(() => handle('Feature: foo'), { message: "'Feature: foo' was unexpected in state: CreateFeatureState on line 1'" });
    });
  });

  describe('Language Events', () => {
    it('should error', () => {
      throws(() => handle('# Language: English'), { message: "'# Language: English' was unexpected in state: CreateFeatureState on line 1'" });
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
      handle('Scenario: First scenario');
      eq(machine.state, 'CreateScenarioState');
    });

    it('should capture scenarios', () => {
      handle('Scenario: First scenario');

      const exported = specification.serialise();
      eq(exported.scenarios.length, 1);
      eq(exported.scenarios[0].title, 'First scenario');
    });

    it('should capture scenarios with annotations', () => {
      handle('@one=1');
      handle('@two=2');
      handle('Scenario: First scenario');

      const exported = specification.serialise();
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
      handle('# Some comment');
      eq(machine.state, 'CreateFeatureState');
    });
  });

  describe('Text Events', () => {
    it('should not cause transition', () => {
      handle('Some text');
      eq(machine.state, 'CreateFeatureState');
    });

    it('should capture description', () => {
      handle('Some text');
      handle('Some more text');

      const exported = specification.serialise();
      eq(exported.description, 'Some text\nSome more text');
    });
  });

  function handle(line, number = 1, indentation = SpecificationParser.getIndentation(line)) {
    state.handle({ line, number, indentation }, session);
  }
});
