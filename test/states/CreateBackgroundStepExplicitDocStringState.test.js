import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, States, Languages, utils } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { CreateBackgroundStepExplicitDocStringState } = States;

describe('CreateBackgroundStepExplicitDocStringState', () => {
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
    featureBuilder.createBackground({ annotations: [], title: 'Meh' });
    featureBuilder.createBackgroundStep({ annotations: [], text: 'Meh' });

    machine = new StateMachine({ featureBuilder });
    machine.toCreateBackgroundStepExplicitDocStringState();

    state = new CreateBackgroundStepExplicitDocStringState({ featureBuilder, machine });

    session = { language: Languages.English, indentation: 0, docstring: { token: '---' } };
  });

  describe('A blank line', () => {
    it('should not cause a transition', () => {
      interpret('');
      eq(machine.state, 'ConsumeBackgroundStepExplicitDocStringState');
    });

    it('should be captured on the docstring', () => {
      interpret('');
      const exported = featureBuilder.build();
      eq(exported.background.steps[0].docstring, '');
    });
  });

  describe('A blank line indented more deeply than the docstring', () => {
    it('should not cause a transition', () => {
      interpret('   ');
      eq(machine.state, 'ConsumeBackgroundStepExplicitDocStringState');
    });

    it('should be captured on the docstring', () => {
      interpret('   ');
      const exported = featureBuilder.build();
      eq(exported.background.steps[0].docstring, '   ');
    });
  });

  describe('A docstring token', () => {
    it('should cause a transition to AfterBackgroundStepDocStringState', () => {
      throws(() => interpret('---'), { message: `I did not expect the end of an explicit docstring at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('The end of the feature', () => {
    it('should be unexpected', () => {
      throws(() => interpret('\u0000'), { message: `I did not expect the end of the feature at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('A line of text', () => {
    it('should not cause a transition', () => {
      interpret('some text');
      eq(machine.state, 'ConsumeBackgroundStepExplicitDocStringState');
    });

    it('should be captured on the docstring', () => {
      interpret('some text');
      const exported = featureBuilder.build();
      eq(exported.background.steps[0].docstring, 'some text');
    });
  });

  function interpret(line, number = 1, indentation = utils.getIndentation(line)) {
    state.interpret({ line, number, indentation }, session);
  }
});
