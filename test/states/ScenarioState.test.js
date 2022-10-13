import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, States, Languages, utils } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { ScenarioState } = States;

describe('ScenarioState', () => {
  let featureBuilder;
  let machine;
  let state;
  let session;
  const expectedEvents = [
    ' - a blank line',
    ' - a block comment delimiter',
    ' - a single line comment',
    ' - a step',
    ' - an annotation',
  ].join('\n');

  beforeEach(() => {
    featureBuilder = new FeatureBuilder();
    featureBuilder.createFeature({ annotations: [], title: 'Meh' });
    featureBuilder.createScenario({ annotations: [], title: 'Meh' });

    machine = new StateMachine({ featureBuilder });
    machine.toScenarioState();

    state = new ScenarioState({ featureBuilder, machine });

    session = { language: Languages.English, indentation: 0 };
  });

  describe('An annotation', () => {
    it('should not cause a state transition', () => {
      handle('@foo=bar');
      eq(machine.state, 'ScenarioState');
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
      eq(machine.state, 'ScenarioState');
    });
  });

  describe('A block comment', () => {
    it('should cause a transition to ConsumeBlockCommentState', () => {
      handle('###');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  describe('An explicit docstring', () => {
    it('should be unexpected', () => {
      throws(() => handle('---'), { message: `I did not expect the start of an explicit docstring at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('An implicit docstring', () => {
    it('should be unexpected', () => {
      throws(() => handle('   some text'), { message: `I did not expect the start of an implicit docstring at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('The end of the feature', () => {
    it('should be unexpected', () => {
      throws(() => handle('\u0000'), { message: `I did not expect the end of the feature at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('A feature', () => {
    it('should be unexpected', () => {
      throws(() => handle('Feature: foo'), { message: `I did not expect a feature at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('A single line comment', () => {
    it('should not cause a state transition', () => {
      handle('# Some comment');
      eq(machine.state, 'ScenarioState');
    });
  });

  describe('A scenario', () => {
    it('should be unexpected', () => {
      throws(() => handle('Scenario: First scenario'), { message: `I did not expect a scenario at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('A line of text', () => {
    it('should cause a transition to AfterScenarioStepState', () => {
      handle('First step');
      eq(machine.state, 'AfterScenarioStepState');
    });

    it('should be captured without annotations', () => {
      handle('First step');

      const exported = featureBuilder.build();
      eq(exported.scenarios[0].steps.length, 1);
      eq(exported.scenarios[0].steps[0].text, 'First step');
    });

    it('should be captured with annotations', () => {
      handle('@one=1');
      handle('@two=2');
      handle('First step');

      const exported = featureBuilder.build();
      eq(exported.scenarios[0].steps[0].annotations.length, 2);
      deq(exported.scenarios[0].steps[0].annotations[0], { name: 'one', value: '1' });
      deq(exported.scenarios[0].steps[0].annotations[1], { name: 'two', value: '2' });
    });
  });

  function handle(line, number = 1, indentation = utils.getIndentation(line)) {
    state.handle({ line, number, indentation }, session);
  }
});
