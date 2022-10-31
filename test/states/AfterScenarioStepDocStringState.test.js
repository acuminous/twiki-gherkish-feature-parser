import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, Languages, utils } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('AfterScenarioStepDocStringState', () => {
  let featureBuilder;
  let machine;
  let session;
  const expectedEvents = [
    ' - a blank line',
    ' - a block comment delimiter',
    ' - a scenario',
    ' - a single line comment',
    ' - a step',
    ' - an annotation',
  ].join('\n');

  beforeEach(() => {
    featureBuilder = new FeatureBuilder();
    featureBuilder.createFeature({ annotations: [], title: 'Some feature' });
    featureBuilder.createScenario({ annotations: [], title: 'First scenario' });
    featureBuilder.createScenarioStep({ annotations: [], text: 'First step' });

    machine = new StateMachine({ featureBuilder });
    machine.toAfterScenarioStepDocStringState();

    session = { language: Languages.English };
  });

  describe('An annotation', () => {
    it('should not cause a state transition', () => {
      interpret('@foo=bar');
      eq(machine.state, 'AfterScenarioStepDocStringState');
    });
  });

  describe('A background', () => {
    it('should be unexpected', () => {
      throws(() => interpret('Background: Meh'), { message: `I did not expect a background at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('A blank line', () => {
    it('should not cause a state transition', () => {
      interpret('');
      eq(machine.state, 'AfterScenarioStepDocStringState');
    });
  });

  describe('A docstring token', () => {
    it('should be unexpected', () => {
      throws(() => interpret('---'), { message: `I did not expect the start of an explicit docstring at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('The end of the feature', () => {
    it('should cause a transition to FinalState', () => {
      interpret('\u0000');
      eq(machine.state, 'FinalState');
    });
  });

  describe('A feature', () => {
    it('should be unexpected', () => {
      throws(() => interpret('Feature: Meh'), { message: `I did not expect a feature at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('A block comment', () => {
    it('should cause a transition to BlockCommentState', () => {
      interpret('###');
      eq(machine.state, 'BlockCommentState');
    });
  });

  describe('A scenario', () => {
    it('should cause a transition to ScenarioState', () => {
      interpret('Scenario: foo');
      eq(machine.state, 'ScenarioState');
    });

    it('should be captured', () => {
      interpret('Scenario: Second scenario');

      const exported = featureBuilder.build();
      eq(exported.scenarios.length, 2);
      eq(exported.scenarios[0].title, 'First scenario');
      eq(exported.scenarios[1].title, 'Second scenario');
    });

    it('should be captured with annotations', () => {
      interpret('@one=1');
      interpret('@two=2');
      interpret('Scenario: Second scenario');

      const exported = featureBuilder.build();
      eq(exported.scenarios.length, 2);
      eq(exported.scenarios[1].annotations.length, 2);
      eq(exported.scenarios[1].annotations[0].name, 'one');
      eq(exported.scenarios[1].annotations[0].value, '1');
      eq(exported.scenarios[1].annotations[1].name, 'two');
      eq(exported.scenarios[1].annotations[1].value, '2');
    });
  });

  describe('A single line comment', () => {
    it('should not cause a state transition', () => {
      interpret('#');
      eq(machine.state, 'AfterScenarioStepDocStringState');
    });
  });

  describe('A line of text', () => {
    it('should cause a transition to ScenarioStepsState', () => {
      interpret('Second step');
      eq(machine.state, 'ScenarioStepsState');
    });

    it('should be captured', () => {
      interpret('Second step');

      const exported = featureBuilder.build();
      eq(exported.scenarios[0].steps.length, 2);
      eq(exported.scenarios[0].steps[0].text, 'First step');
      eq(exported.scenarios[0].steps[1].text, 'Second step');
    });

    it('should be captureds with annotations', () => {
      interpret('@one=1');
      interpret('@two=2');
      interpret('Bah');

      const exported = featureBuilder.build();
      eq(exported.scenarios[0].steps[1].annotations.length, 2);
      eq(exported.scenarios[0].steps[1].annotations[0].name, 'one');
      eq(exported.scenarios[0].steps[1].annotations[0].value, '1');
      eq(exported.scenarios[0].steps[1].annotations[1].name, 'two');
      eq(exported.scenarios[0].steps[1].annotations[1].value, '2');
    });
  });

  describe('An indented line of text', () => {
    it('should be unexpected', () => {
      session.indentation = 0;
      throws(() => interpret('   some text'), { message: `I did not expect the start of an implicit docstring at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  function interpret(line, number = 1, indentation = utils.getIndentation(line)) {
    machine.interpret({ line, number, indentation }, session);
  }
});
