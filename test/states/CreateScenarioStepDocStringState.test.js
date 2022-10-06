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
    ' - A DocString line',
    ' - The end of an explicit DocString',
    ' - The end of an indented DocString',
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

  describe('Blank Line Events', () => {
    it('should not cause transition', () => {
      session.docString = { token: '---' };
      handle('');
      eq(machine.state, 'CreateScenarioStepDocStringState');
    });
  });

  describe('DocString Indent Start Events', () => {
    it('should error on DocStringIndentStart event', () => {
      session.indentation = 0;
      throws(() => handle('   Some text'), { message: `The start of an indented DocString was not expected at undefined:1\nExpected one of:\n${expectedEvents}\n` });
    });
  });

  describe('DocString Indent Stop Events', () => {
    it('should transition to new AfterScenarioStepDocStringState on DocStringIndentEnd event', () => {
      session.docString = { indentation: 3 };
      session.indentation = 0;
      handle('Some text');
      eq(machine.state, 'AfterScenarioStepState');
    });
  });

  describe('DocString Token Start Events', () => {
    it('should error on DocStringTokenStart event', () => {
      throws(() => handle('---'), { message: `The start of an explicit DocString was not expected at undefined:1\nExpected one of:\n${expectedEvents}\n` });
    });
  });

  describe('DocString Token Stop Events', () => {
    it('should transition to new AfterScenarioStepDocStringState on DocStringTokenStop event', () => {
      session.docString = { token: '---' };
      handle('---');
      eq(machine.state, 'AfterScenarioStepDocStringState');
    });
  });

  describe('End Events', () => {
    it('should transition to final on end event', () => {
      throws(() => handle('\u0000'), { message: `The end of the feature was not expected at undefined:1\nExpected one of:\n${expectedEvents}\n` });
    });
  });

  describe('DocString Events', () => {
    it('should not cause transition', () => {
      session.docString = { token: '---' };
      handle('Some text');
      eq(machine.state, 'CreateScenarioStepDocStringState');
    });

    it('should capture docstrings', () => {
      session.docString = { token: '---' };
      handle('Some text');
      handle('Some more text');

      const exported = featureBuilder.build();
      eq(exported.scenarios[0].steps[0].docString, ['Some text', 'Some more text'].join(os.EOL));
    });
  });

  function handle(line, number = 1, indentation = utils.getIndentation(line)) {
    state.handle({ line, number, indentation }, session);
  }
});
