import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, Languages, utils } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('BackgroundStepsState', () => {
  let featureBuilder;
  let machine;
  const expectedEvents = [
    ' - a blank line',
    ' - a block comment delimiter',
    ' - a scenario',
    ' - a single line comment',
    ' - a step',
    ' - an annotation',
    ' - the start of an explicit docstring',
    ' - the start of an implicit docstring',
  ].join('\n');

  beforeEach(() => {
    featureBuilder = new FeatureBuilder();
    featureBuilder.createFeature({ annotations: [], title: 'Meh' });
    featureBuilder.createBackground({ annotations: [], title: 'Meh' });
    featureBuilder.createBackgroundStep({ annotations: [], text: 'Meh' });

    const session = { language: Languages.English, indentation: 0 };
    machine = new StateMachine({ featureBuilder, session });
    machine.toBackgroundStepsState();
  });

  describe('An annotation', () => {
    it('should not cause a state transition', () => {
      handle('@foo=bar');
      eq(machine.state, 'BackgroundStepsState');
    });
  });

  describe('A background', () => {
    it('should be unexpected', () => {
      throws(() => handle('Background: foo'), { message: `I did not expect a background at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('A blank line', () => {
    it('should not cause a state transition', () => {
      handle('');
      eq(machine.state, 'BackgroundStepsState');
    });
  });

  describe('A block comment delimter', () => {
    it('should cause a transition to BlockCommentState', () => {
      handle('###');
      eq(machine.state, 'BlockCommentState');
    });
  });

  describe('An example table', () => {
    it('should be unexpected', () => {
      throws(() => handle('Where:'), { message: `I did not expect an example table at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('An explicit docstring', () => {
    it('should cause a transition to CreateBackgroundStepExplicitDocStringState', () => {
      handle('---');
      eq(machine.state, 'CreateBackgroundStepExplicitDocStringState');
    });
  });

  describe('An implicit docstring', () => {
    it('should cause a transition to CreateBackgroundStepImplicitDocStringState', () => {
      handle('   some text');
      eq(machine.state, 'CreateBackgroundStepImplicitDocStringState');
    });

    it('should be captured on the docstring', () => {
      handle('   some text');
      const exported = featureBuilder.build();
      eq(exported.background.steps[0].docstring, 'some text');
    });
  });

  describe('The end of the feature', () => {
    it('should be unexpected', () => {
      throws(() => handle('\u0000'), { message: `I did not expect the end of the feature at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('A feature', () => {
    it('should be unexpected', () => {
      throws(() => handle('Feature: foo'), { message: `I did not expect a feature at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('A single line comment', () => {
    it('should not cause a state transition', () => {
      handle('# foo');
      eq(machine.state, 'BackgroundStepsState');
    });
  });

  describe('A scenario', () => {
    it('should cause a transition to ScenarioState', () => {
      handle('Scenario: foo');
      eq(machine.state, 'ScenarioState');
    });

    it('should be captured without annotations', () => {
      handle('Scenario: First scenario');

      const exported = featureBuilder.build();
      eq(exported.scenarios.length, 1);
      eq(exported.scenarios[0].title, 'First scenario');
    });

    it('should be captured with annotations', () => {
      handle('@one = 1');
      handle('@two = 2');
      handle('Scenario: First scenario');

      const exported = featureBuilder.build();
      eq(exported.scenarios.length, 1);
      eq(exported.scenarios[0].annotations.length, 2);
      eq(exported.scenarios[0].annotations[0].name, 'one');
      eq(exported.scenarios[0].annotations[0].value, '1');
      eq(exported.scenarios[0].annotations[1].name, 'two');
      eq(exported.scenarios[0].annotations[1].value, '2');
    });
  });

  describe('A line of text', () => {
    it('should cause a transition to BackgroundStepsState', () => {
      handle('Given some text');
      eq(machine.state, 'BackgroundStepsState');
    });

    it('should be captured without', () => {
      handle('Given some text');

      const exported = featureBuilder.build();
      eq(exported.background.steps.length, 2);
      eq(exported.background.steps[1].text, 'Given some text');
    });

    it('should be captured with annotations', () => {
      handle('@one = 1');
      handle('@two = 2');
      handle('Given some text');

      const exported = featureBuilder.build();
      eq(exported.background.steps[1].annotations.length, 2);
      eq(exported.background.steps[1].annotations[0].name, 'one');
      eq(exported.background.steps[1].annotations[0].value, '1');
      eq(exported.background.steps[1].annotations[1].name, 'two');
      eq(exported.background.steps[1].annotations[1].value, '2');
    });
  });

  function handle(line, number = 1, indentation = utils.getIndentation(line)) {
    machine.handle({ line, number, indentation });
  }
});
