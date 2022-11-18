import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import os from 'node:os';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, utils } from '../../lib/index.js';
import StubSession from '../stubs/StubSession.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('BeginExplicitDocstringState', () => {
  let featureBuilder;
  let machine;

  describe('After a background step', () => {

    const expectedEvents = [
      ' - a docstring line',
    ].join('\n');

    beforeEach(() => {
      featureBuilder = new FeatureBuilder()
        .createFeature({ title: 'Meh' })
        .createBackground({ title: 'Meh' })
        .createStep({ text: 'Meh' });

      const session = new StubSession({ docstring: { delimiter: '---', indentation: 0 } });

      machine = new StateMachine({ featureBuilder, session })
        .toDeclareFeatureState()
        .checkpoint()
        .toDeclareFeatureBackgroundState()
        .toCaptureBackgroundDetailsState()
        .checkpoint()
        .toCaptureBackgroundStepState()
        .toBeginExplicitDocstringState();
    });

    describe('Annotations', () => {
      it('should cause a transition to CaptureExplicitDocstringState', () => {
        interpret('@foo = bar');
        eq(machine.state, 'CaptureExplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('@foo = bar');

        const exported = featureBuilder.build();
        eq(exported.background.steps[0].docstring, '@foo = bar');
      });
    });

    describe('Backgrounds', () => {
      it('should cause a transition to CaptureExplicitDocstringState', () => {
        interpret('Background: foo');
        eq(machine.state, 'CaptureExplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('Background: foo');

        const exported = featureBuilder.build();
        eq(exported.background.steps[0].docstring, 'Background: foo');
      });
    });

    describe('Blank lines', () => {
      it('should cause a transition to CaptureExplicitDocstringState', () => {
        interpret('   ');
        eq(machine.state, 'CaptureExplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('   ');

        const exported = featureBuilder.build();
        eq(exported.background.steps[0].docstring, '   ');
      });
    });

    describe('Example tables', () => {
      it('should cause a transition to CaptureExplicitDocstringState', () => {
        interpret('Where:');
        eq(machine.state, 'CaptureExplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('Where:');

        const exported = featureBuilder.build();
        eq(exported.background.steps[0].docstring, 'Where:');
      });
    });

    describe('Explicit docstring delimiters', () => {
      it('should be unexpected', () => {
        throws(() => interpret('---'), { message: `I did not expect the end of an explicit docstring at index.js:1\nInstead, I expected one of:\n${expectedEvents}\n` });
      });
    });

    describe('End of file', () => {
      it('should be unexpected', () => {
        throws(() => interpret('\u0000'), { message: `I did not expect the end of the feature at index.js:1\nInstead, I expected one of:\n${expectedEvents}\n` });
      });
    });

    describe('Features', () => {
      it('should cause a transition to CaptureExplicitDocstringState', () => {
        interpret('Feature: foo');
        eq(machine.state, 'CaptureExplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('Feature: foo');

        const exported = featureBuilder.build();
        eq(exported.background.steps[0].docstring, 'Feature: foo');
      });
    });

    describe('Block comment delimiters', () => {
      it('should cause a transition to CaptureExplicitDocstringState', () => {
        interpret('###');
        eq(machine.state, 'CaptureExplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('###');

        const exported = featureBuilder.build();
        eq(exported.background.steps[0].docstring, '###');
      });
    });

    describe('Single line comments', () => {
      it('should cause a transition to CaptureExplicitDocstringState', () => {
        interpret('# A comment');
        eq(machine.state, 'CaptureExplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('# A comment');

        const exported = featureBuilder.build();
        eq(exported.background.steps[0].docstring, '# A comment');
      });
    });

    describe('Scenarios', () => {
      it('should cause a transition to CaptureExplicitDocstringState', () => {
        interpret('Scenario: foo');
        eq(machine.state, 'CaptureExplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('Scenario: foo');

        const exported = featureBuilder.build();
        eq(exported.background.steps[0].docstring, 'Scenario: foo');
      });
    });

    describe('Lines of text', () => {
      it('should cause a transition to CaptureExplicitDocstringState', () => {
        interpret('   some text');
        eq(machine.state, 'CaptureExplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('some text');
        interpret('   some more text');

        const exported = featureBuilder.build();
        eq(exported.background.steps[0].docstring, ['some text', '   some more text'].join(os.EOL));
      });
    });
  });

  describe('After a scenario step', () => {
    const expectedEvents = [
      ' - a docstring line',
    ].join('\n');

    beforeEach(() => {
      featureBuilder = new FeatureBuilder()
        .createFeature({ title: 'Meh' })
        .createScenario({ title: 'Meh' })
        .createStep({ text: 'Meh' });

      const session = new StubSession({ docstring: { delimiter: '---', indentation: 0 } });

      machine = new StateMachine({ featureBuilder, session })
        .toDeclareFeatureState()
        .checkpoint()
        .toDeclareScenarioState()
        .toCaptureScenarioDetailsState()
        .checkpoint()
        .toCaptureScenarioStepState()
        .toBeginExplicitDocstringState();
    });

    describe('Annotations', () => {
      it('should cause a transition to CaptureExplicitDocstringState', () => {
        interpret('@foo = bar');
        eq(machine.state, 'CaptureExplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('@foo = bar');

        const exported = featureBuilder.build();
        eq(exported.scenarios[0].steps[0].docstring, '@foo = bar');
      });
    });

    describe('Backgrounds', () => {
      it('should cause a transition to CaptureExplicitDocstringState', () => {
        interpret('Background: foo');
        eq(machine.state, 'CaptureExplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('Background: foo');

        const exported = featureBuilder.build();
        eq(exported.scenarios[0].steps[0].docstring, 'Background: foo');
      });
    });

    describe('Blank lines', () => {
      it('should cause a transition to CaptureExplicitDocstringState', () => {
        interpret('   ');
        eq(machine.state, 'CaptureExplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('   ');

        const exported = featureBuilder.build();
        eq(exported.scenarios[0].steps[0].docstring, '   ');
      });
    });

    describe('Example tables', () => {
      it('should cause a transition to CaptureExplicitDocstringState', () => {
        interpret('Where:');
        eq(machine.state, 'CaptureExplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('Where:');

        const exported = featureBuilder.build();
        eq(exported.scenarios[0].steps[0].docstring, 'Where:');
      });
    });

    describe('Explicit docstring delimiters', () => {
      it('should be unexpected', () => {
        throws(() => interpret('---'), { message: `I did not expect the end of an explicit docstring at index.js:1\nInstead, I expected one of:\n${expectedEvents}\n` });
      });
    });

    describe('End of file', () => {
      it('should be unexpected', () => {
        throws(() => interpret('\u0000'), { message: `I did not expect the end of the feature at index.js:1\nInstead, I expected one of:\n${expectedEvents}\n` });
      });
    });

    describe('Features', () => {
      it('should cause a transition to CaptureExplicitDocstringState', () => {
        interpret('Feature: foo');
        eq(machine.state, 'CaptureExplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('Feature: foo');

        const exported = featureBuilder.build();
        eq(exported.scenarios[0].steps[0].docstring, 'Feature: foo');
      });
    });

    describe('Block comment delimiters', () => {
      it('should cause a transition to CaptureExplicitDocstringState', () => {
        interpret('###');
        eq(machine.state, 'CaptureExplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('###');

        const exported = featureBuilder.build();
        eq(exported.scenarios[0].steps[0].docstring, '###');
      });
    });

    describe('Single line comments', () => {
      it('should cause a transition to CaptureExplicitDocstringState', () => {
        interpret('# A comment');
        eq(machine.state, 'CaptureExplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('# A comment');

        const exported = featureBuilder.build();
        eq(exported.scenarios[0].steps[0].docstring, '# A comment');
      });
    });

    describe('Scenarios', () => {
      it('should cause a transition to CaptureExplicitDocstringState', () => {
        interpret('Scenario: foo');
        eq(machine.state, 'CaptureExplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('Scenario: foo');

        const exported = featureBuilder.build();
        eq(exported.scenarios[0].steps[0].docstring, 'Scenario: foo');
      });
    });

    describe('Lines of text', () => {
      it('should cause a transition to CaptureExplicitDocstringState', () => {
        interpret('   some text');
        eq(machine.state, 'CaptureExplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('some text');
        interpret('   some more text');

        const exported = featureBuilder.build();
        eq(exported.scenarios[0].steps[0].docstring, ['some text', '   some more text'].join(os.EOL));
      });
    });
  });

  function interpret(line, number = 1, indentation = utils.getIndentation(line)) {
    machine.interpret({ line, number, indentation });
  }
});
