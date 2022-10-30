import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import os from 'node:os';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, States, Languages, utils } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { CreateScenarioStepExplicitDocStringState } = States;

describe('CreateScenarioStepExplicitDocStringState', () => {
  let featureBuilder;
  let machine;
  let state;
  let session;
  const expectedEvents = [
    ' - a docstring line',
  ].join('\n');

  beforeEach(() => {
    featureBuilder = new FeatureBuilder();
    featureBuilder.createFeature({ annotations: [], title: 'Meh' });
    featureBuilder.createScenario({ annotations: [], title: 'Meh' });
    featureBuilder.createScenarioStep({ annotations: [], text: 'Meh' });

    machine = new StateMachine({ featureBuilder });
    machine.toCreateScenarioStepExplicitDocStringState();

    state = new CreateScenarioStepExplicitDocStringState({ featureBuilder, machine });

    session = { language: Languages.English, indentation: 0, docstring: { token: '---' } };
  });

  describe('A blank line', () => {
    it('should not cause a state transition', () => {
      interpret('');
      eq(machine.state, 'ConsumeScenarioStepExplicitDocStringState');
    });
  });

  describe('A docstring token', () => {
    it('be unexpected', () => {
      throws(() => interpret('---'), { message: `I did not expect the end of an explicit docstring at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('The end of the feature', () => {
    it('should be unexpected', () => {
      throws(() => interpret('\u0000'), { message: `I did not expect the end of the feature at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('A line of text', () => {
    it('should not cause a state transition', () => {
      interpret('some text');
      eq(machine.state, 'ConsumeScenarioStepExplicitDocStringState');
    });

    it('should be captured', () => {
      interpret('some text');
      interpret('some more text');

      const exported = featureBuilder.build();
      eq(exported.scenarios[0].steps[0].docstring, ['some text', 'some more text'].join(os.EOL));
    });
  });

  describe('An indented line of text', () => {
    it('should not cause a state transition', () => {
      interpret('   some text');
      eq(machine.state, 'ConsumeScenarioStepExplicitDocStringState');
    });

    it('should be captured', () => {
      interpret('   some text');

      const exported = featureBuilder.build();
      eq(exported.scenarios[0].steps[0].docstring, '   some text');
    });
  });

  function interpret(line, number = 1, indentation = utils.getIndentation(line)) {
    state.interpret({ line, number, indentation }, session);
  }
});
