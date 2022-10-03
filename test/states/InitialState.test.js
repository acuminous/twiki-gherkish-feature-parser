import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureParser, FeatureBuilder, StateMachine, States, Languages, utils } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { InitialState } = States;

describe('InitialState', () => {
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
    const parser = new FeatureParser();
    featureBuilder = new FeatureBuilder();
    machine = new StateMachine({ parser, featureBuilder });
    state = new InitialState({ featureBuilder, machine });
    session = { language: Languages.English };
  });

  describe('Annotation Events', () => {
    it('should not cause transition', () => {
      handle('@foo=bar');
      eq(machine.state, 'InitialState');
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
      eq(machine.state, 'InitialState');
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
    it('should transition to CreateFeatureState', () => {
      handle('Feature: foo');
      eq(machine.state, 'CreateFeatureState');
    });

    it('should capture feature title', () => {
      handle('Feature: Some feature');

      const exported = featureBuilder.build();
      eq(exported.title, 'Some feature');
    });

    it('should capture feature annotations', () => {
      handle('@one = 1');
      handle('@two = 2');
      handle('Feature: First scenario');

      const exported = featureBuilder.build();
      eq(exported.annotations.length, 2);
      eq(exported.annotations[0].name, 'one');
      eq(exported.annotations[0].value, '1');
      eq(exported.annotations[1].name, 'two');
      eq(exported.annotations[1].value, '2');
    });
  });

  describe('Block Comment Events', () => {
    it('should transition to ConsumeBlockCommentState', () => {
      handle('###');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  describe('Scenario Events', () => {
    it('should error', () => {
      throws(() => handle('Scenario: foo'), { message: `'Scenario: foo' was unexpected at undefined:1\nExpected one of:\n${expectedEvents}\n` });
    });
  });

  describe('Single Line Comment Events', () => {
    it('should not cause transition', () => {
      handle('# foo');
      eq(machine.state, 'InitialState');
    });
  });

  describe('Text Events', () => {
    it('should error', () => {
      throws(() => handle('Some text'), { message: `'Some text' was unexpected at undefined:1\nExpected one of:\n${expectedEvents}\n` });
    });
  });

  function handle(line, number = 1, indentation = utils.getIndentation(line)) {
    state.handle({ line, number, indentation }, session);
  }
});
