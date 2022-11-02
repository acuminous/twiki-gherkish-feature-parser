import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import os from 'node:os';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, Session, utils } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('CreateScenarioStepExplicitDocStringState', () => {
  let machine;
  const expectedEvents = [
    ' - a docstring line',
  ].join('\n');

  beforeEach(() => {
    const featureBuilder = new FeatureBuilder()
      .createFeature({ annotations: [], title: 'Meh' })
      .createScenario({ annotations: [], title: 'Meh' })
      .createScenarioStep({ annotations: [], text: 'Meh' });

    const session = new Session({ indentation: 0, docstring: { token: '---' } });

    machine = new StateMachine({ featureBuilder, session })
      .toCreateScenarioStepExplicitDocStringState();
  });

  describe('A blank line', () => {
    it('should not cause a state transition', () => {
      interpret('');
      eq(machine.state, 'ConsumeScenarioStepExplicitDocStringState');
    });
  });

  describe('An explicit docstring delimiter', () => {
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

      const exported = machine.build();
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

      const exported = machine.build();
      eq(exported.scenarios[0].steps[0].docstring, '   some text');
    });
  });

  function interpret(line, number = 1, indentation = utils.getIndentation(line)) {
    machine.interpret({ line, number, indentation });
  }
});
