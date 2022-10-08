import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, States, Languages, utils } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { CreateBackgroundStepImplicitDocStringState } = States;

describe('CreateBackgroundStepImplicitDocStringState', () => {
  let featureBuilder;
  let machine;
  let state;
  let session;
  const expectedEvents = [
    ' - a blank line',
    ' - a block comment',
    ' - a scenario',
    ' - a single line comment',
    ' - a step',
    ' - an annotation',
  ].join('\n');

  beforeEach(() => {
    featureBuilder = new FeatureBuilder();
    featureBuilder.createFeature({ annotations: [], title: 'Meh' });
    featureBuilder.createBackground({ annotations: [], title: 'Meh' });
    featureBuilder.createBackgroundStep({ annotations: [], text: 'Meh' });

    machine = new StateMachine({ featureBuilder });
    machine.toCreateBackgroundStepImplicitDocStringState();

    state = new CreateBackgroundStepImplicitDocStringState({ featureBuilder, machine });

    session = { language: Languages.English, indentation: 0, docstring: { indentation: 3 } };
  });

  describe('A blank line indented to the same depth as the docstring', () => {
    it('should not cause a state transition', () => {
      handle('   ');
      eq(machine.state, 'CreateBackgroundStepImplicitDocStringState');
    });

    it('should be captured on the docstring', () => {
      handle('   ');
      const exported = featureBuilder.build();
      eq(exported.background.steps[0].docstring, '');
    });
  });

  describe('A blank line indented more deeply than the docstring', () => {
    it('should not cause a state transition', () => {
      handle('      ');
      eq(machine.state, 'CreateBackgroundStepImplicitDocStringState');
    });

    it('should be captured on the docstring', () => {
      handle('      ');
      const exported = featureBuilder.build();
      eq(exported.background.steps[0].docstring, '   ');
    });
  });

  describe('A blank line outdated to the original depth', () => {
    it('should cause a transition to AfterBackgroundStepDocStringState', () => {
      handle('');
      eq(machine.state, 'AfterBackgroundStepDocStringState');
    });

    it('should not be captured on the docstring', () => {
      handle('');
      const exported = featureBuilder.build();
      eq(exported.background.steps[0].docstring, null);
    });
  });

  describe('A docstring token indented to the same depth as the docstring', () => {
    it('should not cause a state transition', () => {
      handle('   ---');
      eq(machine.state, 'CreateBackgroundStepImplicitDocStringState');
    });

    it('should be captured on the docstring', () => {
      handle('   ---');
      const exported = featureBuilder.build();
      eq(exported.background.steps[0].docstring, '---');
    });
  });

  describe('A docstring token indented more deeply than the docstring', () => {
    it('should not cause a state transition', () => {
      handle('      ---');
      eq(machine.state, 'CreateBackgroundStepImplicitDocStringState');
    });

    it('should be captured on the docstring', () => {
      handle('      ---');
      const exported = featureBuilder.build();
      eq(exported.background.steps[0].docstring, '   ---');
    });
  });

  describe('A docstring token outdented to the original depth', () => {
    it('should be unexpected', () => {
      throws(() => handle('---'), { message: `I did not expect the start of an explicit docstring at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('The end of the feature', () => {
    it('should cause a transition to FinalState', () => {
      handle('\u0000');
      eq(machine.state, 'FinalState');
    });
  });

  describe('A line of text indented to the same depth as the docstring', () => {
    it('should not cause a state transition', () => {
      handle('   some text');
      eq(machine.state, 'CreateBackgroundStepImplicitDocStringState');
    });

    it('should be captured on the docstring', () => {
      handle('   some text');
      const exported = featureBuilder.build();
      eq(exported.background.steps[0].docstring, 'some text');
    });
  });

  function handle(line, number = 1, indentation = utils.getIndentation(line)) {
    state.handle({ line, number, indentation }, session);
  }
});
