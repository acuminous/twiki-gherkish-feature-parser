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
    ' - a block comment delimiter',
    ' - a feature',
    ' - a single line comment',
    ' - an annotation',
  ].join('\n');

  beforeEach(() => {
    const parser = new FeatureParser();
    featureBuilder = new FeatureBuilder();
    machine = new StateMachine({ parser, featureBuilder });
    state = new InitialState({ featureBuilder, machine });
    session = { language: Languages.English, indentation: 0 };
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

  describe('A docstring token', () => {
    it('should be unexpected', () => {
      throws(() => handle('---'), { message: `${state.name} has no event handler for '---' at undefined:1` });
    });
  });

  describe('The end of the feature', () => {
    it('should be unexpected', () => {
      throws(() => handle('\u0000'), { message: `I did not expect the end of the feature at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('A feature', () => {
    it('should cause a transition to FeatureState', () => {
      handle('Feature: foo');
      eq(machine.state, 'FeatureState');
    });

    it('should be caputed', () => {
      handle('Feature: Some feature');

      const exported = featureBuilder.build();
      eq(exported.title, 'Some feature');
    });

    it('should be captured with annotations', () => {
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

  describe('A line of text', () => {
    it('should be unexpected', () => {
      throws(() => handle('some text'), { message: `${state.name} has no event handler for 'some text' at undefined:1` });
    });
  });

  describe('An indented line of text', () => {
    it('should be unexpected', () => {
      throws(() => handle('   some text'), { message: `${state.name} has no event handler for '   some text' at undefined:1` });
    });
  });

  function handle(line, number = 1, indentation = utils.getIndentation(line)) {
    state.handle({ line, number, indentation }, session);
  }
});
