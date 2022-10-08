import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import os from 'node:os';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, States, Languages, utils } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { CreateBackgroundStepDocStringState } = States;

describe('CreateBackgroundStepDocStringState', () => {
  let featureBuilder;
  let machine;
  let state;
  let session;
  const expectedEvents = [
    ' - a DocString line',
    ' - the end of an explicit DocString',
    ' - the end of an indented DocString',
  ].join('\n');

  beforeEach(() => {
    featureBuilder = new FeatureBuilder();
    featureBuilder.createFeature({ annotations: [], title: 'Meh' });
    featureBuilder.createBackground({ annotations: [], title: 'Meh' });
    featureBuilder.createBackgroundStep({ annotations: [], text: 'Meh' });

    machine = new StateMachine({ featureBuilder });
    machine.toCreateBackgroundStepDocStringState();

    state = new CreateBackgroundStepDocStringState({ featureBuilder, machine });

    session = { language: Languages.English, indentation: 0 };
  });

  describe('Blank Line Events', () => {
    it('should not cause transition', () => {
      session.docString = { token: '---' };
      handle('');
      eq(machine.state, 'CreateBackgroundStepDocStringState');
    });
  });

  describe('DocString Indent Start Events', () => {
    it('should error on DocStringIndentStart event', () => {
      session.indentation = 0;
      throws(() => handle('   some text'), { message: `I did not expect the start of an indented DocString at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('DocString Indent Stop Events', () => {
    it('should transition to new AfterBackgroundStepDocStringState on DocStringIndentEnd event', () => {
      session.docString = { indentation: 3 };
      session.indentation = 0;
      handle('some text');
      eq(machine.state, 'AfterBackgroundStepState');
    });
  });

  describe('DocString Token Start Events', () => {
    it('should error on DocStringTokenStart event', () => {
      throws(() => handle('---'), { message: `I did not expect the start of an explicit DocString at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('DocString Token Stop Events', () => {
    it('should transition to new AfterBackgroundStepDocStringState on DocStringTokenStop event', () => {
      session.docString = { token: '---' };
      handle('---');
      eq(machine.state, 'AfterBackgroundStepDocStringState');
    });
  });

  describe('End Events', () => {
    it('should transition to final on end event', () => {
      throws(() => handle('\u0000'), { message: `I did not expect the end of the feature at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('DocString Text Events', () => {
    it('should not cause transition', () => {
      session.docString = { token: '---' };
      handle('some text');
      eq(machine.state, 'CreateBackgroundStepDocStringState');
    });

    it('should capture docstrings', () => {
      session.docString = { token: '---' };
      handle('some text');
      handle('Some more text');

      const exported = featureBuilder.build();
      eq(exported.background.steps[0].docString, ['some text', 'Some more text'].join(os.EOL));
    });
  });

  function handle(line, number = 1, indentation = utils.getIndentation(line)) {
    state.handle({ line, number, indentation }, session);
  }
});
