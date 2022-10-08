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
    ' - a blank line',
    ' - a block comment',
    ' - a feature',
    ' - a single line comment',
    ' - an annotation',
  ].join('\n');

  beforeEach(() => {
    const parser = new FeatureParser();
    featureBuilder = new FeatureBuilder();
    machine = new StateMachine({ parser, featureBuilder });
    state = new InitialState({ featureBuilder, machine });
    session = { language: Languages.English };
  });

  describe('An annotation', () => {
    it('should not cause a state transition', () => {
      handle('@foo=bar');
      eq(machine.state, 'InitialState');
    });
  });

  describe('A background', () => {
    it('should be unexpected', () => {
      throws(() => handle('Background: foo'), { message: `${state.name} has no event handler for 'Background: foo' at undefined:1` });
    });
  });

  describe('A blank line', () => {
    it('should not cause a state transition', () => {
      handle('');
      eq(machine.state, 'InitialState');
    });
  });

  describe('An indented blank line', () => {
    it('should be unexpected', () => {
      session.indentation = 0;
      throws(() => handle('   some text'), { message: `${state.name} has no event handler for '   some text' at undefined:1` });
    });
  });

  describe('DocString Indent Stop Events', () => {
    it('should be unexpected', () => {
      session.docstring = { indentation: 3 };
      session.indentation = 0;
      throws(() => handle('some text'), { message: `${state.name} has no event handler for 'some text' at undefined:1` });
    });
  });

  describe('A docstring token', () => {
    it('should be unexpected', () => {
      throws(() => handle('---'), { message: `${state.name} has no event handler for '---' at undefined:1` });
    });
  });

  describe('DocString Token Stop Events', () => {
    it('should be unexpected', () => {
      session.docstring = { token: '---' };
      throws(() => handle('---'), { message: `${state.name} has no event handler for '---' at undefined:1` });
    });
  });

  describe('The end of the feature', () => {
    it('should be unexpected', () => {
      throws(() => handle('\u0000'), { message: `I did not expect the end of the feature at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('A feature', () => {
    it('should cause a transition to CreateFeatureState', () => {
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

  describe('A block comment', () => {
    it('should cause a transition to ConsumeBlockCommentState', () => {
      handle('###');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  describe('A scenario', () => {
    it('should be unexpected', () => {
      throws(() => handle('Scenario: foo'), { message: `${state.name} has no event handler for 'Scenario: foo' at undefined:1` });
    });
  });

  describe('A single line comment', () => {
    it('should not cause a state transition', () => {
      handle('# foo');
      eq(machine.state, 'InitialState');
    });
  });

  describe('Text Events', () => {
    it('should be unexpected', () => {
      throws(() => handle('some text'), { message: `${state.name} has no event handler for 'some text' at undefined:1` });
    });
  });

  function handle(line, number = 1, indentation = utils.getIndentation(line)) {
    state.handle({ line, number, indentation }, session);
  }
});
