import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, Languages, utils } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('CreateScenarioStepImplicitDocStringState', () => {
  let machine;
  const expectedEvents = [
    ' - a blank line',
    ' - a block comment delimiter',
    ' - a scenario',
    ' - a single line comment',
    ' - a step',
    ' - an annotation',
  ].join('\n');

  beforeEach(() => {
    const featureBuilder = new FeatureBuilder();
    featureBuilder.createFeature({ annotations: [], title: 'Meh' });
    featureBuilder.createScenario({ annotations: [], title: 'Meh' });
    featureBuilder.createScenarioStep({ annotations: [], text: 'Meh' });

    const session = { language: Languages.English, indentation: 0, docstring: { indentation: 3 } };
    machine = new StateMachine({ featureBuilder, session });
    machine.toCreateScenarioStepImplicitDocStringState();
  });

  describe('A blank line indented to the same depth as the docstring', () => {
    it('should not cause a state transition', () => {
      handle('   ');
      eq(machine.state, 'CreateScenarioStepImplicitDocStringState');
    });

    it('should be captured on the docstring', () => {
      handle('   ');
      const exported = machine.build();
      eq(exported.scenarios[0].steps[0].docstring, '');
    });
  });

  describe('A blank line indented more deeply than the docstring', () => {
    it('should not cause a state transition', () => {
      handle('      ');
      eq(machine.state, 'CreateScenarioStepImplicitDocStringState');
    });

    it('should be captured on the docstring', () => {
      handle('      ');
      const exported = machine.build();
      eq(exported.scenarios[0].steps[0].docstring, '   ');
    });
  });

  describe('A blank line outdated to the original depth', () => {
    it('should cause a transition to AfterScenarioStepDocStringState', () => {
      handle('');
      eq(machine.state, 'AfterScenarioStepDocStringState');
    });

    it('should not be captured on the docstring', () => {
      handle('');
      const exported = machine.build();
      eq(exported.scenarios[0].steps[0].docstring, null);
    });
  });

  describe('A docstring token indented to the same depth as the docstring', () => {
    it('should not cause a state transition', () => {
      handle('   ---');
      eq(machine.state, 'CreateScenarioStepImplicitDocStringState');
    });

    it('should be captured on the docstring', () => {
      handle('   ---');
      const exported = machine.build();
      eq(exported.scenarios[0].steps[0].docstring, '---');
    });
  });

  describe('A docstring token indented more deeply than the docstring', () => {
    it('should not cause a state transition', () => {
      handle('      ---');
      eq(machine.state, 'CreateScenarioStepImplicitDocStringState');
    });

    it('should be captured on the docstring', () => {
      handle('      ---');
      const exported = machine.build();
      eq(exported.scenarios[0].steps[0].docstring, '   ---');
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
      eq(machine.state, 'CreateScenarioStepImplicitDocStringState');
    });

    it('should be captured on the docstring', () => {
      handle('   some text');
      const exported = machine.build();
      eq(exported.scenarios[0].steps[0].docstring, 'some text');
    });
  });

  function handle(line, number = 1, indentation = utils.getIndentation(line)) {
    machine.interpret({ line, number, indentation });
  }
});
