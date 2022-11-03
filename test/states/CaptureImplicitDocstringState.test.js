import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine } from '../../lib/index.js';
import StubSession from '../stubs/StubSession.js';
import * as utils from '../../lib/utils.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('CaptureImplicitDocstringState', () => {
  let featureBuilder;
  let machine;

  describe('After a background step', () => {

    const expectedEvents = [
      ' - a blank line',
      ' - a block comment delimiter',
      ' - a scenario',
      ' - a single line comment',
      ' - a step',
      ' - an annotation',
    ].join('\n');

    beforeEach(() => {
      featureBuilder = new FeatureBuilder()
        .createFeature({ title: 'Meh' })
        .createBackground({ title: 'Meh' })
        .createStep({ text: 'First step' });

      const session = new StubSession({ indentation: 0, docstring: { indentation: 3 } });

      machine = new StateMachine({ featureBuilder, session })
        .toDeclareFeatureState()
        .checkpoint()
        .toDeclareBackgroundState()
        .toCaptureBackgroundDetailsState()
        .checkpoint()
        .toCaptureBackgroundStepState()
        .toCaptureImplicitDocstringState();
    });

    describe('An indented annotation', () => {
      it('should not cause a state transition', () => {
        interpret('   @foo = bar');
        eq(machine.state, 'CaptureImplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('   @foo = bar');

        const exported = featureBuilder.build();
        eq(exported.background.steps[0].docstring, '@foo = bar');
      });
    });

    describe('An outdented annotation', () => {
      it('should cause a state transition to CaptureBackgroundDetailsState', () => {
        interpret('@foo = bar');
        eq(machine.state, 'CaptureBackgroundDetailsState');
      });
    });

    describe('An indented background', () => {
      it('should not cause a state transition', () => {
        interpret('   Background: foo');
        eq(machine.state, 'CaptureImplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('   Background: foo');

        const exported = featureBuilder.build();
        eq(exported.background.steps[0].docstring, 'Background: foo');
      });
    });

    describe('An outdented background', () => {
      it('should be unexpected', () => {
        throws(() => interpret('Background: foo'), { message: `I did not expect a background at index.js:1\nInstead, I expected one of:\n${expectedEvents}\n` });
      });
    });

    describe('An indented blank line', () => {
      it('should not cause a state transition', () => {
        interpret('      ');
        eq(machine.state, 'CaptureImplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('      ');

        const exported = featureBuilder.build();
        eq(exported.background.steps[0].docstring, '   ');
      });
    });

    describe('An outdented blank line', () => {
      it('should cause a transition to CaptureBackgroundDetailsState', () => {
        interpret('');
        eq(machine.state, 'CaptureBackgroundDetailsState');
      });
    });

    describe('An indented example table', () => {
      it('should not cause a state transition', () => {
        interpret('   Where:');
        eq(machine.state, 'CaptureImplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('   Where:');

        const exported = featureBuilder.build();
        eq(exported.background.steps[0].docstring, 'Where:');
      });
    });

    describe('An outdented example table', () => {
      it('should be unexpected', () => {
        throws(() => interpret('Where:'), { message: `I did not expect an example table at index.js:1\nInstead, I expected one of:\n${expectedEvents}\n` });
      });
    });

    describe('An indented explicit docstring delimiter', () => {
      it('should not cause a state transition', () => {
        interpret('   ---');
        eq(machine.state, 'CaptureImplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('   ---');

        const exported = featureBuilder.build();
        eq(exported.background.steps[0].docstring, '---');
      });
    });

    describe('An outdented explicit docstring delimiter', () => {
      it('should be unexpected', () => {
        throws(() => interpret('---'), { message: `I did not expect the start of an explicit docstring at index.js:1\nInstead, I expected one of:\n${expectedEvents}\n` });
      });
    });

    describe('An indented line of text', () => {
      it('should not cause a state transition', () => {
        interpret('   some more text');
        eq(machine.state, 'CaptureImplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('   some more text');

        const exported = featureBuilder.build();
        eq(exported.background.steps[0].docstring, 'some more text');
      });
    });

    describe('An outdented line of text', () => {
      it('should cause a transition to CaptureBackgroundStepState', () => {
        interpret('some text');
        eq(machine.state, 'CaptureBackgroundStepState');
      });
    });

    describe('The end of the feature', () => {
      it('should be unexpected', () => {
        throws(() => interpret('\u0000'), { message: `I did not expect the end of the feature at index.js:1\nInstead, I expected one of:\n${expectedEvents}\n` });
      });
    });

    describe('An indented block comment delimiter', () => {
      it('should not cause a state transition', () => {
        interpret('   ###');
        eq(machine.state, 'CaptureImplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('   ###');

        const exported = featureBuilder.build();
        eq(exported.background.steps[0].docstring, '###');
      });
    });

    describe('An outdented block comment delimiter', () => {
      it('should cause a transition to ConsumeBlockCommentState', () => {
        interpret('###');
        eq(machine.state, 'ConsumeBlockCommentState');
      });
    });

    describe('An indented single line comment', () => {
      it('should not cause a state transition', () => {
        interpret('   # A comment');
        eq(machine.state, 'CaptureImplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('   # A comment');

        const exported = featureBuilder.build();
        eq(exported.background.steps[0].docstring, '# A comment');
      });
    });

    describe('An outdented single line comment', () => {
      it('should cause a transition to CaptureBackgroundDetailsState', () => {
        interpret('# A comment');
        eq(machine.state, 'CaptureBackgroundDetailsState');
      });
    });

    describe('An indented scenario', () => {
      it('should not cause a state transition', () => {
        interpret('   Scenario: foo');
        eq(machine.state, 'CaptureImplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('   Scenario: foo');

        const exported = featureBuilder.build();
        eq(exported.background.steps[0].docstring, 'Scenario: foo');
      });
    });

    describe('An outdented scenario', () => {
      it('should cause a transition to DeclareScenarioState', () => {
        interpret('Scenario: foo');
        eq(machine.state, 'DeclareScenarioState');
      });
    });
  });

  describe('After a scenario step', () => {

    const expectedEvents = [
      ' - a blank line',
      ' - a block comment delimiter',
      ' - a scenario',
      ' - a single line comment',
      ' - a step',
      ' - an annotation',
      ' - an example table',
      ' - the end of the feature',
    ].join('\n');

    beforeEach(() => {
      featureBuilder = new FeatureBuilder()
        .createFeature({ title: 'Meh' })
        .createScenario({ title: 'Meh' })
        .createStep({ text: 'First step' });

      const session = new StubSession({ indentation: 0, docstring: { indentation: 3 } });

      machine = new StateMachine({ featureBuilder, session })
        .toDeclareFeatureState()
        .checkpoint()
        .toDeclareScenarioState()
        .toCaptureScenarioDetailsState()
        .checkpoint()
        .toCaptureScenarioStepState()
        .toCaptureImplicitDocstringState();
    });

    describe('An indented annotation', () => {
      it('should not cause a state transition', () => {
        interpret('   @foo = bar');
        eq(machine.state, 'CaptureImplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('   @foo = bar');

        const exported = featureBuilder.build();
        eq(exported.scenarios[0].steps[0].docstring, '@foo = bar');
      });
    });

    describe('An outdented annotation', () => {
      it('should cause a state transition to CaptureScenarioDetailsState', () => {
        interpret('@foo = bar');
        eq(machine.state, 'CaptureScenarioDetailsState');
      });
    });

    describe('An indented background', () => {
      it('should not cause a state transition', () => {
        interpret('   Background: foo');
        eq(machine.state, 'CaptureImplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('   Background: foo');

        const exported = featureBuilder.build();
        eq(exported.scenarios[0].steps[0].docstring, 'Background: foo');
      });
    });

    describe('An outdented background', () => {
      it('should be unexpected', () => {
        throws(() => interpret('Background: foo'), { message: `I did not expect a background at index.js:1\nInstead, I expected one of:\n${expectedEvents}\n` });
      });
    });

    describe('An indented blank line', () => {
      it('should not cause a state transition', () => {
        interpret('      ');
        eq(machine.state, 'CaptureImplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('      ');

        const exported = featureBuilder.build();
        eq(exported.scenarios[0].steps[0].docstring, '   ');
      });
    });

    describe('An outdented blank line', () => {
      it('should cause a transition to CaptureScenarioDetailsState', () => {
        interpret('');
        eq(machine.state, 'CaptureScenarioDetailsState');
      });
    });

    describe('An indented example table', () => {
      it('should not cause a state transition', () => {
        interpret('   Where:');
        eq(machine.state, 'CaptureImplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('   Where:');

        const exported = featureBuilder.build();
        eq(exported.scenarios[0].steps[0].docstring, 'Where:');
      });
    });

    describe('An outdented example table', () => {
      it('should cause a tranistion to DeclareExampleTableState', () => {
        interpret('Where:');
        eq(machine.state, 'DeclareExampleTableState');
      });
    });

    describe('An indented explicit docstring delimiter', () => {
      it('should not cause a state transition', () => {
        interpret('   some more text');
        eq(machine.state, 'CaptureImplicitDocstringState');
      });
    });

    describe('An outdented explicit docstring delimiter', () => {
      it('should be unexpected', () => {
        throws(() => interpret('---'), { message: `I did not expect the start of an explicit docstring at index.js:1\nInstead, I expected one of:\n${expectedEvents}\n` });
      });
    });

    describe('An indented line of text', () => {
      it('should not cause a state transition', () => {
        interpret('   some more text');
        eq(machine.state, 'CaptureImplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('   some more text');

        const exported = featureBuilder.build();
        eq(exported.scenarios[0].steps[0].docstring, 'some more text');
      });
    });

    describe('An outdented line of text', () => {
      it('should cause a transition to CaptureScenarioStepState', () => {
        interpret('some text');
        eq(machine.state, 'CaptureScenarioStepState');
      });
    });

    describe('The end of the feature', () => {
      it('should cause a transition to FinalState', () => {
        interpret('\u0000');
        eq(machine.state, 'FinalState');
      });
    });

    describe('An indented block comment delimiter', () => {
      it('should not cause a state transition', () => {
        interpret('   ###');
        eq(machine.state, 'CaptureImplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('   ###');

        const exported = featureBuilder.build();
        eq(exported.scenarios[0].steps[0].docstring, '###');
      });
    });

    describe('An outdented block comment delimiter', () => {
      it('should cause a transition to ConsumeBlockCommentState', () => {
        interpret('###');
        eq(machine.state, 'ConsumeBlockCommentState');
      });
    });

    describe('An indented single line comment', () => {
      it('should not cause a state transition', () => {
        interpret('   # A comment');
        eq(machine.state, 'CaptureImplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('   # A comment');

        const exported = featureBuilder.build();
        eq(exported.scenarios[0].steps[0].docstring, '# A comment');
      });
    });

    describe('An outdented single line comment', () => {
      it('should cause a transition to CaptureScenarioDetailsState', () => {
        interpret('# A comment');
        eq(machine.state, 'CaptureScenarioDetailsState');
      });
    });

    describe('An indented scenario', () => {
      it('should not cause a state transition', () => {
        interpret('   Scenario: foo');
        eq(machine.state, 'CaptureImplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('   Scenario: foo');

        const exported = featureBuilder.build();
        eq(exported.scenarios[0].steps[0].docstring, 'Scenario: foo');
      });
    });

    describe('An outdented scenario', () => {
      it('should cause a transition to DeclareScenarioState', () => {
        interpret('Scenario: foo');
        eq(machine.state, 'DeclareScenarioState');
      });
    });
  });

  function interpret(line, number = 1, indentation = utils.getIndentation(line)) {
    machine.interpret({ line, number, indentation });
  }
});
