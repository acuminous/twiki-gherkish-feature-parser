import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import os from 'node:os';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, States, Languages, utils } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { CreateScenarioStepDocStringState } = States;

describe('CreateScenarioStepDocStringState', () => {
  let featureBuilder;
  let machine;
  let state;
  let session;
  const expectedEvents = [
    ' - a docstring line',
    ' - the end of an explicit docstring',
    ' - the end of an indented docstring',
  ].join('\n');

  beforeEach(() => {
    featureBuilder = new FeatureBuilder();
    featureBuilder.createFeature({ annotations: [], title: 'Meh' });
    featureBuilder.createScenario({ annotations: [], title: 'Meh' });
    featureBuilder.createScenarioStep({ annotations: [], text: 'Meh' });

    machine = new StateMachine({ featureBuilder });
    machine.toCreateScenarioStepDocStringState();

    state = new CreateScenarioStepDocStringState({ featureBuilder, machine });

    session = { language: Languages.English, indentation: 0 };
  });

  describe('A blank line', () => {
    it('should not cause a state transition', () => {
      session.docstring = { token: '---' };
      handle('');
      eq(machine.state, 'CreateScenarioStepDocStringState');
    });
  });

  describe('An indented blank line', () => {
    it('should be unexpected on docstringIndentStart event', () => {
      session.indentation = 0;
      throws(() => handle('   some text'), { message: `I did not expect the start of an indented docstring at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('DocString Indent Stop Events', () => {
    it('should cause a state transition to AfterScenarioStepDocStringState', () => {
      session.docstring = { indentation: 3 };
      session.indentation = 0;
      handle('some text');
      eq(machine.state, 'AfterScenarioStepState');
    });
  });

  describe('A docstring token', () => {
    it('should be unexpected on docstringTokenStart event', () => {
      throws(() => handle('---'), { message: `I did not expect the start of an explicit docstring at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('DocString Token Stop Events', () => {
    it('should cause a state transition to AfterScenarioStepDocStringState', () => {
      session.docstring = { token: '---' };
      handle('---');
      eq(machine.state, 'AfterScenarioStepDocStringState');
    });
  });

  describe('The end of the feature', () => {
    it('should cause a state transition to final on end event', () => {
      throws(() => handle('\u0000'), { message: `I did not expect the end of the feature at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('DocString Text Events', () => {
    it('should not cause a state transition', () => {
      session.docstring = { token: '---' };
      handle('some text');
      eq(machine.state, 'CreateScenarioStepDocStringState');
    });

    it('should capture docstrings', () => {
      session.docstring = { token: '---' };
      handle('some text');
      handle('Some more text');

      const exported = featureBuilder.build();
      eq(exported.scenarios[0].steps[0].docstring, ['some text', 'Some more text'].join(os.EOL));
    });
  });

  function handle(line, number = 1, indentation = utils.getIndentation(line)) {
    state.handle({ line, number, indentation }, session);
  }
});
