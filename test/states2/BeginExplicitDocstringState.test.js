import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import os from 'node:os';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, Session, utils } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('BeginExplicitDocstringState', () => {
  let machine;

  describe('After a background step', () => {

    const expectedEvents = [
      ' - a docstring line',
    ].join('\n');

    beforeEach(() => {
      const featureBuilder = new FeatureBuilder()
        .createFeature({ title: 'Meh' })
        .createBackground({ title: 'Meh' })
        .createStep({ text: 'Meh' });

      const session = new Session({ docstring: { token: '---', indentation: 0 } });

      machine = new StateMachine({ featureBuilder, session }, true)
        .toInitialState()
        .toDeclareFeatureState()
        .checkpoint()
        .toDeclareBackgroundState()
        .toCaptureBackgroundDetailsState()
        .checkpoint()
        .toCaptureBackgroundStepState()
        .toBeginExplicitDocstringState();
    });

    describe('An annotation', () => {
      it('should cause a transition to CaptureExplicitDocstringState', () => {
        interpret('@foo = bar');
        eq(machine.state, 'CaptureExplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('@foo = bar');

        const exported = machine.build();
        eq(exported.background.steps[0].docstring, '@foo = bar');
      });
    });

    describe('A background', () => {
      it('should cause a transition to CaptureExplicitDocstringState', () => {
        interpret('Background: foo');
        eq(machine.state, 'CaptureExplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('Background: foo');

        const exported = machine.build();
        eq(exported.background.steps[0].docstring, 'Background: foo');
      });
    });

    describe('A blank line', () => {
      it('should cause a transition to CaptureExplicitDocstringState', () => {
        interpret('   ');
        eq(machine.state, 'CaptureExplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('   ');

        const exported = machine.build();
        eq(exported.background.steps[0].docstring, '   ');
      });
    });

    describe('An example table', () => {
      it('should cause a transition to CaptureExplicitDocstringState', () => {
        interpret('Where:');
        eq(machine.state, 'CaptureExplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('Where:');

        const exported = machine.build();
        eq(exported.background.steps[0].docstring, 'Where:');
      });
    });

    describe('An explicit docstring delimiter', () => {
      it('should be unexpected', () => {
        throws(() => interpret('---'), { message: `I did not expect the end of an explicit docstring at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
      });
    });

    describe('The end of the feature', () => {
      it('should be unexpected', () => {
        throws(() => interpret('\u0000'), { message: `I did not expect the end of the feature at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
      });
    });

    describe('A feature', () => {
      it('should cause a transition to CaptureExplicitDocstringState', () => {
        interpret('Feature: foo');
        eq(machine.state, 'CaptureExplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('Feature: foo');

        const exported = machine.build();
        eq(exported.background.steps[0].docstring, 'Feature: foo');
      });
    });

    describe('A block comment delimiter', () => {
      it('should cause a transition to CaptureExplicitDocstringState', () => {
        interpret('###');
        eq(machine.state, 'CaptureExplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('###');

        const exported = machine.build();
        eq(exported.background.steps[0].docstring, '###');
      });
    });

    describe('A single line comment', () => {
      it('should cause a transition to CaptureExplicitDocstringState', () => {
        interpret('# A comment');
        eq(machine.state, 'CaptureExplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('# A comment');

        const exported = machine.build();
        eq(exported.background.steps[0].docstring, '# A comment');
      });
    });

    describe('A scenario', () => {
      it('should cause a transition to CaptureExplicitDocstringState', () => {
        interpret('Scenario: foo');
        eq(machine.state, 'CaptureExplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('Scenario: foo');

        const exported = machine.build();
        eq(exported.background.steps[0].docstring, 'Scenario: foo');
      });
    });

    describe('A line of text', () => {
      it('should cause a transition to CaptureExplicitDocstringState', () => {
        interpret('   some text');
        eq(machine.state, 'CaptureExplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('some text');
        interpret('   some more text');

        const exported = machine.build();
        eq(exported.background.steps[0].docstring, ['some text', '   some more text'].join(os.EOL));
      });
    });
  });

  describe('After a scenario step', () => {
    const expectedEvents = [
      ' - a docstring line',
    ].join('\n');

    beforeEach(() => {
      const featureBuilder = new FeatureBuilder()
        .createFeature({ title: 'Meh' })
        .createScenario({ title: 'Meh' })
        .createStep({ text: 'Meh' });

      const session = new Session({ docstring: { token: '---', indentation: 0 } });

      machine = new StateMachine({ featureBuilder, session }, true)
        .toDeclareFeatureState()
        .checkpoint()
        .toDeclareScenarioState()
        .toCaptureScenarioDetailsState()
        .checkpoint()
        .toCaptureScenarioStepState()
        .toBeginExplicitDocstringState();
    });

    describe('An annotation', () => {
      it('should cause a transition to CaptureExplicitDocstringState', () => {
        interpret('@foo = bar');
        eq(machine.state, 'CaptureExplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('@foo = bar');

        const exported = machine.build();
        eq(exported.scenarios[0].steps[0].docstring, '@foo = bar');
      });
    });

    describe('A background', () => {
      it('should cause a transition to CaptureExplicitDocstringState', () => {
        interpret('Background: foo');
        eq(machine.state, 'CaptureExplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('Background: foo');

        const exported = machine.build();
        eq(exported.scenarios[0].steps[0].docstring, 'Background: foo');
      });
    });

    describe('A blank line', () => {
      it('should cause a transition to CaptureExplicitDocstringState', () => {
        interpret('   ');
        eq(machine.state, 'CaptureExplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('   ');

        const exported = machine.build();
        eq(exported.scenarios[0].steps[0].docstring, '   ');
      });
    });

    describe('An example table', () => {
      it('should cause a transition to CaptureExplicitDocstringState', () => {
        interpret('Where:');
        eq(machine.state, 'CaptureExplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('Where:');

        const exported = machine.build();
        eq(exported.scenarios[0].steps[0].docstring, 'Where:');
      });
    });

    describe('An explicit docstring delimiter', () => {
      it('should be unexpected', () => {
        throws(() => interpret('---'), { message: `I did not expect the end of an explicit docstring at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
      });
    });

    describe('The end of the feature', () => {
      it('should be unexpected', () => {
        throws(() => interpret('\u0000'), { message: `I did not expect the end of the feature at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
      });
    });

    describe('A feature', () => {
      it('should cause a transition to CaptureExplicitDocstringState', () => {
        interpret('Feature: foo');
        eq(machine.state, 'CaptureExplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('Feature: foo');

        const exported = machine.build();
        eq(exported.scenarios[0].steps[0].docstring, 'Feature: foo');
      });
    });

    describe('A block comment delimiter', () => {
      it('should cause a transition to CaptureExplicitDocstringState', () => {
        interpret('###');
        eq(machine.state, 'CaptureExplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('###');

        const exported = machine.build();
        eq(exported.scenarios[0].steps[0].docstring, '###');
      });
    });

    describe('A single line comment', () => {
      it('should cause a transition to CaptureExplicitDocstringState', () => {
        interpret('# A comment');
        eq(machine.state, 'CaptureExplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('# A comment');

        const exported = machine.build();
        eq(exported.scenarios[0].steps[0].docstring, '# A comment');
      });
    });

    describe('A scenario', () => {
      it('should cause a transition to CaptureExplicitDocstringState', () => {
        interpret('Scenario: foo');
        eq(machine.state, 'CaptureExplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('Scenario: foo');

        const exported = machine.build();
        eq(exported.scenarios[0].steps[0].docstring, 'Scenario: foo');
      });
    });

    describe('A line of text', () => {
      it('should cause a transition to CaptureExplicitDocstringState', () => {
        interpret('   some text');
        eq(machine.state, 'CaptureExplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('some text');
        interpret('   some more text');

        const exported = machine.build();
        eq(exported.scenarios[0].steps[0].docstring, ['some text', '   some more text'].join(os.EOL));
      });
    });
  });

  function interpret(line, number = 1, indentation = utils.getIndentation(line)) {
    machine.interpret({ line, number, indentation });
  }
});
