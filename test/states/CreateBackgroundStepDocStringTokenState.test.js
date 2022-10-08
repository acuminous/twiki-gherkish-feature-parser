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

    session = { language: Languages.English, indentation: 0, docString: { token: '---' } };
  });

  describe('Blank Line Events', () => {
    it('should not cause transition', () => {
      handle('');
      eq(machine.state, 'CreateBackgroundStepDocStringState');
    });
  });

  describe('DocString Indent Start Events', () => {
    it('should not cause transition', () => {
      handle('   some text');
      eq(machine.state, 'CreateBackgroundStepDocStringState');
    });
  });

  describe('DocString Indent Stop Events', () => {
    it('should not cause transition', () => {
      session.indentation = 3;
      handle('some text');
      eq(machine.state, 'CreateBackgroundStepDocStringState');
    });
  });

  describe('DocString Token Stop Events', () => {
    it('should transition to new AfterBackgroundStepDocStringState on DocStringTokenStop event', () => {
      handle('---');
      eq(machine.state, 'AfterBackgroundStepDocStringState');
    });
  });

  describe('End Events', () => {
    it('should error on End event', () => {
      throws(() => handle('\u0000'), { message: `I did not expect the end of the feature at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('DocString Text Events', () => {
    it('should not cause transition', () => {
      handle('some text');
      eq(machine.state, 'CreateBackgroundStepDocStringState');
    });

    it('should capture docstrings', () => {
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
