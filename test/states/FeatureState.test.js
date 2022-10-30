import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, States, Languages, utils } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { FeatureState } = States;

describe('FeatureState', () => {
  let featureBuilder;
  let machine;
  let state;
  let session;
  const expectedEvents = [
    ' - a background',
    ' - a blank line',
    ' - a block comment delimiter',
    ' - a scenario',
    ' - a single line comment',
    ' - an annotation',
    ' - some text',
  ].join('\n');

  beforeEach(() => {
    featureBuilder = new FeatureBuilder();
    featureBuilder.createFeature({ annotations: [], title: 'Meh' });

    machine = new StateMachine({ featureBuilder });
    machine.toFeatureState();

    state = new FeatureState({ featureBuilder, machine });

    session = { language: Languages.English, indentation: 0 };
  });

  describe('An annotation', () => {
    it('should not cause a state transition', () => {
      interpret('@foo=bar');
      eq(machine.state, 'FeatureState');
    });
  });

  describe('A background', () => {
    it('should cause a transition to BackgroundState', () => {
      interpret('Background: foo');
      eq(machine.state, 'BackgroundState');
    });

    it('should capture backgrounds with annotations', () => {
      interpret('@one=1');
      interpret('@two=2');
      interpret('Background: First background');

      const exported = featureBuilder.build();
      eq(exported.background.annotations.length, 2);
      eq(exported.background.annotations[0].name, 'one');
      eq(exported.background.annotations[0].value, '1');
      eq(exported.background.annotations[1].name, 'two');
      eq(exported.background.annotations[1].value, '2');
    });
  });

  describe('A blank line', () => {
    it('should not cause a state transition', () => {
      interpret('');
      eq(machine.state, 'FeatureState');
    });
  });

  describe('A block comment delimiter', () => {
    it('should cause a transition to BlockCommentState', () => {
      interpret('###');
      eq(machine.state, 'BlockCommentState');
    });
  });

  describe('An example table', () => {
    it('should be unexpected', () => {
      throws(() => interpret('Where:'), { message: `I did not expect an example table at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('An explicit docstring', () => {
    it('should be unexpected', () => {
      throws(() => interpret('---'), { message: `I did not expect the start of an explicit docstring at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('The end of the feature', () => {
    it('should be unexpected', () => {
      throws(() => interpret('\u0000'), { message: `I did not expect the end of the feature at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('A feature', () => {
    it('should be unexpected', () => {
      throws(() => interpret('Feature: foo'), { message: `I did not expect a feature at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('A single line comment', () => {
    it('should not cause a state transition', () => {
      interpret('# Some comment');
      eq(machine.state, 'FeatureState');
    });
  });

  describe('A scenario', () => {
    it('should cause a transition to ScenarioState', () => {
      interpret('Scenario: First scenario');
      eq(machine.state, 'ScenarioState');
    });

    it('should be captured without annotations', () => {
      interpret('Scenario: First scenario');

      const exported = featureBuilder.build();
      eq(exported.scenarios.length, 1);
      eq(exported.scenarios[0].title, 'First scenario');
    });

    it('should be captured with annotations', () => {
      interpret('@one=1');
      interpret('@two=2');
      interpret('Scenario: First scenario');

      const exported = featureBuilder.build();
      eq(exported.scenarios.length, 1);
      eq(exported.scenarios[0].annotations.length, 2);
      deq(exported.scenarios[0].annotations[0], { name: 'one', value: '1' });
      deq(exported.scenarios[0].annotations[1], { name: 'two', value: '2' });
    });
  });

  describe('A line of text', () => {
    it('should not cause a state transition', () => {
      interpret('some text');
      eq(machine.state, 'FeatureState');
    });

    it('should be captured in the feature description', () => {
      interpret('some text');
      interpret('some more text');
      interpret('   some indented text');

      const exported = featureBuilder.build();
      eq(exported.description, 'some text\nsome more text\n   some indented text');
    });
  });

  function interpret(line, number = 1, indentation = utils.getIndentation(line)) {
    state.interpret({ line, number, indentation }, session);
  }
});
