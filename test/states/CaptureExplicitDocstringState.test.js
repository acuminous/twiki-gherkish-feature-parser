import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import os from 'node:os';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine } from '../../lib/index.js';
import StubSession from '../stubs/StubSession.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('CaptureExplicitDocstringState', () => {
  let featureBuilder;
  let machine;
  const expectedEvents = [
    ' - a docstring line',
    ' - the end of an explicit docstring',
  ].join('\n');

  beforeEach(() => {
    featureBuilder = new FeatureBuilder()
      .createFeature({ title: 'Meh' })
      .createScenario({ title: 'Meh' })
      .createStep({ text: 'First step' })
      .createDocstring({ text: 'some text' });

    const session = new StubSession({ docstring: { token: '---' } });

    machine = new StateMachine({ featureBuilder, session })
      .toDeclareFeatureState()
      .checkpoint()
      .toDeclareScenarioState()
      .toCaptureScenarioDetailsState()
      .checkpoint()
      .toCaptureScenarioStepState()
      .toBeginExplicitDocstringState()
      .toCaptureExplicitDocstringState();
  });

  describe('An annotation', () => {
    it('should not cause a state transition', () => {
      interpret('@foo = bar');
      eq(machine.state, 'CaptureExplicitDocstringState');
    });

    it('should be captured', () => {
      interpret('@foo = bar');

      const exported = featureBuilder.build();
      eq(exported.scenarios[0].steps[0].docstring, ['some text', '@foo = bar'].join(os.EOL));
    });
  });

  describe('A background', () => {
    it('should not cause a state transition', () => {
      interpret('Background: foo');
      eq(machine.state, 'CaptureExplicitDocstringState');
    });

    it('should be captured', () => {
      interpret('Background: foo');

      const exported = featureBuilder.build();
      eq(exported.scenarios[0].steps[0].docstring, ['some text', 'Background: foo'].join(os.EOL));
    });
  });

  describe('A blank line', () => {
    it('should not cause a state transition', () => {
      interpret('');
      eq(machine.state, 'CaptureExplicitDocstringState');
    });

    it('should be captured', () => {
      interpret('');

      const exported = featureBuilder.build();
      eq(exported.scenarios[0].steps[0].docstring, ['some text', ''].join(os.EOL));
    });
  });

  describe('An example table', () => {
    it('should not cause a state transition', () => {
      interpret('Where:');
      eq(machine.state, 'CaptureExplicitDocstringState');
    });

    it('should be captured', () => {
      interpret('Where:');

      const exported = featureBuilder.build();
      eq(exported.scenarios[0].steps[0].docstring, ['some text', 'Where:'].join(os.EOL));
    });
  });

  describe('An explicit docstring delimiter', () => {
    it('should cause a transition to CaptureScenarioDetailsState', () => {
      interpret('---');
      eq(machine.state, 'CaptureScenarioDetailsState');
    });
  });

  describe('An indented line of text', () => {
    it('should not cause a state transition', () => {
      interpret('   some more text');
      eq(machine.state, 'CaptureExplicitDocstringState');
    });

    it('should be captured', () => {
      interpret('   some more text');

      const exported = featureBuilder.build();
      eq(exported.scenarios[0].steps[0].docstring, ['some text', '   some more text'].join(os.EOL));
    });
  });

  describe('The end of the feature', () => {
    it('should be unexpected', () => {
      throws(() => interpret('\u0000'), { message: `I did not expect the end of the feature at index.js:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('A feature', () => {
    it('should not cause a state transition', () => {
      interpret('Feature: foo');
      eq(machine.state, 'CaptureExplicitDocstringState');
    });

    it('should be captured', () => {
      interpret('Feature: foo');

      const exported = featureBuilder.build();
      eq(exported.scenarios[0].steps[0].docstring, ['some text', 'Feature: foo'].join(os.EOL));
    });
  });

  describe('A block comment delimiter', () => {
    it('should not cause a state transition', () => {
      interpret('###');
      eq(machine.state, 'CaptureExplicitDocstringState');
    });

    it('should be captured', () => {
      interpret('###');

      const exported = featureBuilder.build();
      eq(exported.scenarios[0].steps[0].docstring, ['some text', '###'].join(os.EOL));
    });
  });

  describe('A single line comment', () => {
    it('should not cause a state transition', () => {
      interpret('# A comment');
      eq(machine.state, 'CaptureExplicitDocstringState');
    });

    it('should be captured', () => {
      interpret('# A comment');

      const exported = featureBuilder.build();
      eq(exported.scenarios[0].steps[0].docstring, ['some text', '# A comment'].join(os.EOL));
    });
  });

  describe('A scenario', () => {
    it('should not cause a state transition', () => {
      interpret('Scenario: foo');
      eq(machine.state, 'CaptureExplicitDocstringState');
    });

    it('should be captured', () => {
      interpret('Scenario: foo');

      const exported = featureBuilder.build();
      eq(exported.scenarios[0].steps[0].docstring, ['some text', 'Scenario: foo'].join(os.EOL));
    });
  });

  describe('A line of text', () => {
    it('should not cause a state transition', () => {
      interpret('some more text');
      eq(machine.state, 'CaptureExplicitDocstringState');
    });

    it('should be captured', () => {
      interpret('some more text');

      const exported = featureBuilder.build();
      eq(exported.scenarios[0].steps[0].docstring, ['some text', 'some more text'].join(os.EOL));
    });
  });

  function interpret(line, number = 1) {
    machine.interpret({ line, number });
  }
});
