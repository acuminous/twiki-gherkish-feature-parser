import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, States, Languages, utils } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { ScenarioStepsState } = States;

describe('ScenarioStepsState', () => {
  let featureBuilder;
  let machine;
  let state;
  let session;
  const expectedEvents = [
    ' - a blank line',
    ' - a block comment delimiter',
    ' - a scenario',
    ' - a single line comment',
    ' - a step',
    ' - an annotation',
    ' - an example table',
    ' - the end of the feature',
    ' - the start of an explicit docstring',
    ' - the start of an implicit docstring',
  ].join('\n');

  beforeEach(() => {
    featureBuilder = new FeatureBuilder();
    featureBuilder.createFeature({ annotations: [], title: 'Some feature' });
    featureBuilder.createScenario({ annotations: [], title: 'First scenario' });
    featureBuilder.createScenarioStep({ annotations: [], text: 'First step' });

    machine = new StateMachine({ featureBuilder });
    machine.toScenarioStepsState();

    state = new ScenarioStepsState({ featureBuilder, machine });

    session = { language: Languages.English, indentation: 0 };
  });

  describe('An annotation', () => {
    it('should not cause a state transition', () => {
      handle('@foo=bar');
      eq(machine.state, 'ScenarioStepsState');
    });
  });

  describe('A background', () => {
    it('should be unexpected', () => {
      throws(() => handle('Background: Meh'), { message: `I did not expect a background at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('A blank line', () => {
    it('should not cause a state transition', () => {
      handle('');
      eq(machine.state, 'ScenarioStepsState');
    });
  });

  describe('A block comment', () => {
    it('should cause a transition to ConsumeBlockCommentState', () => {
      handle('###');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  describe('An examples table', () => {
    it('should cause a transition to CreateScenarioExampleTableState', () => {
      handle('Where:');
      eq(machine.state, 'CreateScenarioExampleTableState');
    });
  });

  describe('An explicit docstring', () => {
    it('should cause a transition to CreateScenarioStepExplicitDocStringState', () => {
      handle('---');
      eq(machine.state, 'CreateScenarioStepExplicitDocStringState');
    });
  });

  describe('An implicit docstring', () => {
    it('should cause a transition to CreateScenarioStepImplicitDocStringState', () => {
      session.indentation = 0;
      handle('   some text');
      eq(machine.state, 'CreateScenarioStepImplicitDocStringState');
    });

    it('should capture docstrings', () => {
      handle('   some text');
      const exported = featureBuilder.build();
      eq(exported.scenarios[0].steps[0].docstring, 'some text');
    });
  });

  describe('The end of the feature', () => {
    it('should cause a transition to FinalState', () => {
      handle('\u0000');
      eq(machine.state, 'FinalState');
    });
  });

  describe('A feature', () => {
    it('should be unexpected', () => {
      throws(() => handle('Feature: Meh'), { message: `I did not expect a feature at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('A single line comment', () => {
    it('should not cause a state transition', () => {
      handle('#');
      eq(machine.state, 'ScenarioStepsState');
    });
  });

  describe('A scenario', () => {
    it('should cause a transition to ScenarioState', () => {
      handle('Scenario: foo');
      eq(machine.state, 'ScenarioState');
    });

    it('should be captured without annotations', () => {
      handle('Scenario: Second scenario');

      const exported = featureBuilder.build();
      eq(exported.scenarios.length, 2);
      eq(exported.scenarios[0].title, 'First scenario');
      eq(exported.scenarios[1].title, 'Second scenario');
    });

    it('should be captured with annotations', () => {
      handle('@one=1');
      handle('@two=2');
      handle('Scenario: Second scenario');

      const exported = featureBuilder.build();
      eq(exported.scenarios.length, 2);
      eq(exported.scenarios[1].annotations.length, 2);
      eq(exported.scenarios[1].annotations[0].name, 'one');
      eq(exported.scenarios[1].annotations[0].value, '1');
      eq(exported.scenarios[1].annotations[1].name, 'two');
      eq(exported.scenarios[1].annotations[1].value, '2');
    });
  });

  describe('A line of text', () => {
    it('should cause a transition to ScenarioStepsState', () => {
      handle('Second step');
      eq(machine.state, 'ScenarioStepsState');
    });

    it('should be captured without annotations', () => {
      handle('Second step');

      const exported = featureBuilder.build();

      eq(exported.scenarios[0].steps.length, 2);
      eq(exported.scenarios[0].steps[0].text, 'First step');
      eq(exported.scenarios[0].steps[1].text, 'Second step');
    });

    it('should be captured with annotations', () => {
      handle('@one=1');
      handle('@two=2');
      handle('Bah');

      const exported = featureBuilder.build();
      eq(exported.scenarios[0].steps[1].annotations.length, 2);
      deq(exported.scenarios[0].steps[1].annotations[0], { name: 'one', value: '1' });
      deq(exported.scenarios[0].steps[1].annotations[1], { name: 'two', value: '2' });
    });
  });

  function handle(line, number = 1, indentation = utils.getIndentation(line)) {
    state.handle({ line, number, indentation }, session);
  }
});
