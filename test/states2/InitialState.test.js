import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureParser, FeatureBuilder, StateMachine, States2 as States, Languages, utils } from '../../lib/index.js';

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
    featureBuilder = new FeatureBuilder();
    machine = new StateMachine({ featureBuilder }, true);
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
      throws(() => handle('Background: foo'), { message: `I did not expect a background at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('A blank line', () => {
    it('should not cause a state transition', () => {
      handle('');
      eq(machine.state, 'InitialState');
    });
  });

  describe('An explicit docstring', () => {
    it('should be unexpected', () => {
      throws(() => handle('---'), { message: `I did not expect the start of an explicit docstring at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('An implicit docstring', () => {
    it('should be unexpected', () => {
      throws(() => handle('   some text'), { message: `I did not expect some text at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('The end of the feature', () => {
    it('should be unexpected', () => {
      throws(() => handle('\u0000'), { message: `I did not expect the end of the feature at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('An example table', () => {
    it('should be unexpected', () => {
      throws(() => handle('Where:'), { message: `I did not expect an example table at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('A feature', () => {
    it('should cause a transition to DeclareFeatureState', () => {
      handle('Feature: foo');
      eq(machine.state, 'DeclareFeatureState');
    });

    it('should be caputed without annotations', () => {
      handle('Feature: Some feature');

      const exported = featureBuilder.build();
      eq(exported.title, 'Some feature');
      eq(exported.annotations.length, 0);
    });

    it('should be captured with annotations', () => {
      handle('@one = 1');
      handle('@two = 2');
      handle('Feature: First scenario');

      const exported = featureBuilder.build();
      eq(exported.annotations.length, 2);
      deq(exported.annotations[0], { name: 'one', value: '1' });
      deq(exported.annotations[1], { name: 'two', value: '2' });
    });
  });

  describe('A block comment delimiter', () => {
    it('should cause a transition to BlockCommentState', () => {
      handle('###');
      eq(machine.state, 'BlockCommentState');
    });
  });

  describe('A single line comment', () => {
    it('should not cause a state transition', () => {
      handle('# foo');
      eq(machine.state, 'InitialState');
    });
  });

  describe('A scenario', () => {
    it('should be unexpected', () => {
      throws(() => handle('Scenario: foo'), { message: `I did not expect a scenario at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('A line of text', () => {
    it('should be unexpected', () => {
      throws(() => handle('some text'), { message: `I did not expect some text at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  function handle(line, number = 1, indentation = utils.getIndentation(line)) {
    state.handle({ line, number, indentation }, session);
  }
});
