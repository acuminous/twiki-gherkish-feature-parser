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
    ' - foo',
    ' - bar',
    ' - baz',
  ].join('\n');

  beforeEach(() => {
    featureBuilder = new FeatureBuilder();
    featureBuilder.createFeature({ annotations: [], title: 'Meh' });

    machine = new StateMachine({ featureBuilder });
    machine.toCreateBackgroundState({ featureBuilder });

    state = new CreateBackgroundState({ machine, featureBuilder });

    session = { language: Languages.English };
  });

  describe('Annotation Events', () => {
    it('should not cause transition', () => {
      handle('@foo=bar');
      eq(machine.state, 'CreateBackgroundState');
    });
  });

  describe('Background Events', () => {
    it('should error', () => {
      throws(() => handle('Background: foo'), { message: `'Background: foo' was unexpected at undefined:1\nExpected one of:\n${expectedEvents}\n` });
    });
  });

  describe('Blank Line Events', () => {
    it('should not cause transition', () => {
      handle('');
      eq(machine.state, 'CreateBackgroundState');
    });
  });

  describe('DocString Indent Start Events', () => {
    it('should error on DocStringIndentStart event', () => {
      session.indentation = 0;
      throws(() => handle('   Some text'), { message: `'   Some text' was unexpected at undefined:1\nExpected one of:\n${expectedEvents}\n` });
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
    it('should error on DocStringTokenStart event', () => {
      throws(() => handle('---'), { message: `'---' was unexpected at undefined:1\nExpected one of:\n${expectedEvents}\n` });
    });
  });

  describe('DocString Token Stop Events', () => {
    it('should error on DocStringTokenStop event', () => {
      session.docString = { token: '---' };
      throws(() => handle('---'), { message: `'---' was unexpected at undefined:1\nExpected one of:\n${expectedEvents}\n` });
    });
  });

  describe('End Events', () => {
    it('should error', () => {
      throws(() => handle('\u0000'), { message: `Unexpected end of feature at undefined:1\nExpected one of:\n${expectedEvents}\n` });
    });
  });

  describe('Feature Events', () => {
    it('should error', () => {
      throws(() => handle('Feature: foo'), { message: `'Feature: foo' was unexpected at undefined:1\nExpected one of:\n${expectedEvents}\n` });
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
      throws(() => handle('Scenario: First scenario'), { message: `'Scenario: First scenario' was unexpected at undefined:1\nExpected one of:\n${expectedEvents}\n` });
    });
  });

  describe('Single Line Comment Events', () => {
    it('should not cause transition', () => {
      handle('# Some comment');
      eq(machine.state, 'CreateBackgroundState');
    });
  });

  describe('Step Events', () => {
    it('should transition to AfterBackgroundStepState on step event', () => {
      featureBuilder.createBackground({ annotations: [] });

      handle('First step');

      eq(machine.state, 'AfterBackgroundStepState');
    });

    it('should capture steps', () => {
      featureBuilder.createBackground({ annotations: [] });

      handle('First step');

      const exported = featureBuilder.build();
      eq(exported.background.steps.length, 1);
      eq(exported.background.steps[0].text, 'First step');
    });

    it('should capture steps with annotations', () => {
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
