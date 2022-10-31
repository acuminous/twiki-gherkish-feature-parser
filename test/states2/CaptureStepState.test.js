import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, utils } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('CaptureStepState', () => {
  let machine;

  describe('Background Steps', () => {

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
      const featureBuilder = new FeatureBuilder()
        .createFeature({ title: 'Meh' })
        .createBackground({ title: 'Meh' })
        .createStep({ text: 'First step' });

      machine = new StateMachine({ featureBuilder }, true)
        .toDeclareFeatureState()
        .checkpoint()
        .toDeclareBackgroundState()
        .toCaptureBackgroundDetailsState()
        .checkpoint()
        .toCaptureStepState();
    });

    describe('An annotation', () => {
      it('should not cause a state transition', () => {
        interpret('@foo=bar');
        eq(machine.state, 'CaptureStepState');
      });
    });

    describe('A background', () => {
      it('should be unexpected', () => {
        throws(() => interpret('Background: foo'), { message: `I did not expect a background at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
      });
    });

    describe('A blank line', () => {
      it('should not cause a state transition', () => {
        interpret('');
        eq(machine.state, 'CaptureStepState');
      });
    });

    describe('A block comment delimter', () => {
      it('should cause a transition to BlockCommentState', () => {
        interpret('###');
        eq(machine.state, 'BlockCommentState');
      });
    });

    describe('An example table', () => {
      it('should be unexpected', () => {
        throws(() => interpret('Where:'), { message: `I did not expect an example table at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
      });
    });

    describe('An explicit docstring', () => {
      it('should cause a transition to BeginExplicitDocstringState', () => {
        interpret('---');
        eq(machine.state, 'BeginExplicitDocstringState');
      });

      it('should checkpoint', () => {
        interpret('---');
        machine.toPreviousCheckpoint();
        eq(machine.state, 'CaptureStepState');
      });
    });

    describe('An implicit docstring', () => {
      it('should cause a transition to CaptureImplicitDocstringState', () => {
        interpret('   some text');
        eq(machine.state, 'CaptureImplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('   some text');

        const exported = machine.build();
        eq(exported.background.steps[0].docstring, 'some text');
      });

      it('should checkpoint', () => {
        interpret('   some text');
        machine.toPreviousCheckpoint();
        eq(machine.state, 'CaptureStepState');
      });
    });

    describe('The end of the feature', () => {
      it('should be unexpected', () => {
        throws(() => interpret('\u0000'), { message: `I did not expect the end of the feature at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
      });
    });

    describe('A feature', () => {
      it('should be unexpected', () => {
        throws(() => interpret('Feature: foo'), { message: `I did not expect a feature at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
      });
    });

    describe('A single line comment', () => {
      it('should not cause a state transition', () => {
        interpret('# foo');
        eq(machine.state, 'CaptureStepState');
      });
    });

    describe('A scenario', () => {
      it('should cause a transition to DeclareScenarioState', () => {
        interpret('Scenario: foo');
        eq(machine.state, 'DeclareScenarioState');
      });

      it('should be captured without annotations', () => {
        interpret('Scenario: First scenario');

        const exported = machine.build();
        eq(exported.scenarios.length, 1);
        eq(exported.scenarios[0].title, 'First scenario');
        eq(exported.scenarios[0].annotations.length, 0);
      });

      it('should be captured with annotations', () => {
        interpret('@one = 1');
        interpret('@two = 2');
        interpret('Scenario: First scenario');

        const exported = machine.build();
        eq(exported.scenarios.length, 1);
        eq(exported.scenarios[0].annotations.length, 2);
        eq(exported.scenarios[0].annotations[0].name, 'one');
        eq(exported.scenarios[0].annotations[0].value, '1');
        eq(exported.scenarios[0].annotations[1].name, 'two');
        eq(exported.scenarios[0].annotations[1].value, '2');
      });
    });

    describe('A line of text', () => {
      it('should cause a transition to CaptureStepState', () => {
        interpret('Given some text');
        eq(machine.state, 'CaptureStepState');
      });

      it('should be captured without annotations', () => {
        interpret('Given some text');

        const exported = machine.build();
        eq(exported.background.steps.length, 2);
        eq(exported.background.steps[1].text, 'Given some text');
        eq(exported.background.steps[1].annotations.length, 0);
      });

      it('should be captured with annotations', () => {
        interpret('@one = 1');
        interpret('@two = 2');
        interpret('Given some text');

        const exported = machine.build();
        eq(exported.background.steps[1].annotations.length, 2);
        eq(exported.background.steps[1].annotations[0].name, 'one');
        eq(exported.background.steps[1].annotations[0].value, '1');
        eq(exported.background.steps[1].annotations[1].name, 'two');
        eq(exported.background.steps[1].annotations[1].value, '2');
      });
    });

    it('should append to existing steps', () => {
      interpret('Second step');
      interpret('Third step');

      const exported = machine.build();
      eq(exported.background.steps.length, 3);
      eq(exported.background.steps[0].text, 'First step');
      eq(exported.background.steps[1].text, 'Second step');
      eq(exported.background.steps[2].text, 'Third step');
    });
  });

  describe('Scenario Steps', () => {

    const expectedEvents = [
      ' - a blank line',
      ' - a block comment delimiter',
      ' - a scenario',
      ' - a single line comment',
      ' - a step',
      ' - an annotation',
      ' - an example table',
      ' - the end of the feature',
      ' - the start of an explicit docstring',
      ' - the start of an implicit docstring',
    ].join('\n');

    beforeEach(() => {
      const featureBuilder = new FeatureBuilder()
        .createFeature({ title: 'Meh' })
        .createScenario({ title: 'First scenario' })
        .createStep({ text: 'First step' });

      machine = new StateMachine({ featureBuilder }, true)
        .toDeclareFeatureState()
        .checkpoint()
        .toDeclareScenarioState()
        .toCaptureScenarioDetailsState()
        .checkpoint()
        .toCaptureStepState();
    });

    describe('An annotation', () => {
      it('should not cause a state transition', () => {
        interpret('@foo=bar');
        eq(machine.state, 'CaptureStepState');
      });
    });

    describe('A background', () => {
      it('should be unexpected', () => {
        throws(() => interpret('Background: Meh'), { message: `I did not expect a background at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
      });
    });

    describe('A blank line', () => {
      it('should not cause a state transition', () => {
        interpret('');
        eq(machine.state, 'CaptureStepState');
      });
    });

    describe('A block comment', () => {
      it('should cause a transition to BlockCommentState', () => {
        interpret('###');
        eq(machine.state, 'BlockCommentState');
      });
    });

    describe('An example table', () => {
      it('should cause a transition to DeclareExampleTableState', () => {
        interpret('Where:');
        eq(machine.state, 'DeclareExampleTableState');
      });
    });

    describe('An explicit docstring', () => {
      it('should cause a transition to BeginExplicitDocstringState', () => {
        interpret('---');
        eq(machine.state, 'BeginExplicitDocstringState');
      });

      it('should checkpoint', () => {
        interpret('---');
        machine.toPreviousCheckpoint();
        eq(machine.state, 'CaptureStepState');
      });
    });

    describe('An implicit docstring', () => {
      it('should cause a transition to CaptureImplicitDocstringState', () => {
        interpret('   some text');
        eq(machine.state, 'CaptureImplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('   some text');

        const exported = machine.build();
        eq(exported.scenarios[0].steps[0].docstring, 'some text');
      });

      it('should checkpoint', () => {
        interpret('   some text');
        machine.toPreviousCheckpoint();
        eq(machine.state, 'CaptureStepState');
      });
    });

    describe('The end of the feature', () => {
      it('should cause a transition to FinalState', () => {
        interpret('\u0000');
        eq(machine.state, 'FinalState');
      });
    });

    describe('A feature', () => {
      it('should be unexpected', () => {
        throws(() => interpret('Feature: Meh'), { message: `I did not expect a feature at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
      });
    });

    describe('A single line comment', () => {
      it('should not cause a state transition', () => {
        interpret('#');
        eq(machine.state, 'CaptureStepState');
      });
    });

    describe('A scenario', () => {
      it('should cause a transition to DeclareScenarioState', () => {
        interpret('Scenario: foo');
        eq(machine.state, 'DeclareScenarioState');
      });

      it('should be captured without annotations', () => {
        interpret('Scenario: Second scenario');

        const exported = machine.build();
        eq(exported.scenarios.length, 2);
        eq(exported.scenarios[0].title, 'First scenario');
        eq(exported.scenarios[1].title, 'Second scenario');
      });

      it('should be captured with annotations', () => {
        interpret('@one=1');
        interpret('@two=2');
        interpret('Scenario: Second scenario');

        const exported = machine.build();
        eq(exported.scenarios.length, 2);
        eq(exported.scenarios[1].annotations.length, 2);
        eq(exported.scenarios[1].annotations[0].name, 'one');
        eq(exported.scenarios[1].annotations[0].value, '1');
        eq(exported.scenarios[1].annotations[1].name, 'two');
        eq(exported.scenarios[1].annotations[1].value, '2');
      });
    });

    describe('A line of text', () => {
      it('should cause a transition to CaptureStepState', () => {
        interpret('Second step');
        eq(machine.state, 'CaptureStepState');
      });

      it('should be captured without annotations', () => {
        interpret('Second step');

        const exported = machine.build();

        eq(exported.scenarios[0].steps.length, 2);
        eq(exported.scenarios[0].steps[1].text, 'Second step');
      });

      it('should be captured with annotations', () => {
        interpret('@one=1');
        interpret('@two=2');
        interpret('Bah');

        const exported = machine.build();
        eq(exported.scenarios[0].steps[1].annotations.length, 2);
        deq(exported.scenarios[0].steps[1].annotations[0], { name: 'one', value: '1' });
        deq(exported.scenarios[0].steps[1].annotations[1], { name: 'two', value: '2' });
      });

      it('should append to existing steps', () => {
        interpret('Second step');
        interpret('Third step');

        const exported = machine.build();
        eq(exported.scenarios[0].steps.length, 3);
        eq(exported.scenarios[0].steps[0].text, 'First step');
        eq(exported.scenarios[0].steps[1].text, 'Second step');
        eq(exported.scenarios[0].steps[2].text, 'Third step');
      });
    });
  });

  function interpret(line, number = 1, indentation = utils.getIndentation(line)) {
    machine.interpret({ line, number, indentation });
  }
});
