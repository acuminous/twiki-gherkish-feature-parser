import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureParser, FeatureBuilder, StateMachine, Languages, utils } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('InitialState', () => {
  let featureBuilder;
  let machine;
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
    session = { language: Languages.English, indentation: 0 };
  });

  describe('An annotation', () => {
    it('should not cause a state transition', () => {
      interpret('@foo=bar');
      eq(machine.state, 'InitialState');
    });
  });

  describe('A background', () => {
    it('should be unexpected', () => {
      throws(() => interpret('Background: foo'), { message: `I did not expect a background at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('A blank line', () => {
    it('should not cause a state transition', () => {
      interpret('');
      eq(machine.state, 'InitialState');
    });
  });

  describe('An explicit docstring', () => {
    it('should be unexpected', () => {
      throws(() => interpret('---'), { message: `I did not expect the start of an explicit docstring at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('An implicit docstring', () => {
    it('should be unexpected', () => {
      throws(() => interpret('   some text'), { message: `I did not expect some text at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('The end of the feature', () => {
    it('should be unexpected', () => {
      throws(() => interpret('\u0000'), { message: `I did not expect the end of the feature at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('An example table', () => {
    it('should be unexpected', () => {
      throws(() => interpret('Where:'), { message: `I did not expect an example table at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('A feature', () => {
    it('should cause a transition to FeatureState', () => {
      interpret('Feature: foo');
      eq(machine.state, 'FeatureState');
    });

    it('should be caputed without annotations', () => {
      interpret('Feature: Some feature');

      const exported = featureBuilder.build();
      eq(exported.title, 'Some feature');
    });

    it('should be captured with annotations', () => {
      interpret('@one = 1');
      interpret('@two = 2');
      interpret('Feature: First scenario');

      const exported = featureBuilder.build();
      eq(exported.annotations.length, 2);
      deq(exported.annotations[0], { name: 'one', value: '1' });
      deq(exported.annotations[1], { name: 'two', value: '2' });
    });
  });

  describe('A block comment delimiter', () => {
    it('should cause a transition to BlockCommentState', () => {
      interpret('###');
      eq(machine.state, 'BlockCommentState');
    });
  });

  describe('A single line comment', () => {
    it('should not cause a state transition', () => {
      interpret('# foo');
      eq(machine.state, 'InitialState');
    });
  });

  describe('A scenario', () => {
    it('should be unexpected', () => {
      throws(() => interpret('Scenario: foo'), { message: `I did not expect a scenario at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('A line of text', () => {
    it('should be unexpected', () => {
      throws(() => interpret('some text'), { message: `I did not expect some text at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  function interpret(line, number = 1, indentation = utils.getIndentation(line)) {
    machine.interpret({ line, number, indentation }, session);
  }
});
