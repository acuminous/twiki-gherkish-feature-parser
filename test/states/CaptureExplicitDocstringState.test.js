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
      .createDocstring({ text: 'some docstring' });

    const session = new StubSession({ docstring: { delimiter: '---' } });

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

  describe('Annotations', () => {
    it('should not cause a state transition', () => {
      interpret('@foo = bar');
      eq(machine.state, 'CaptureExplicitDocstringState');
    });

    it('should be captured', () => {
      interpret('@foo = bar');

      const exported = featureBuilder.build();
      eq(exported.scenarios[0].steps[0].docstring, ['some docstring', '@foo = bar'].join(os.EOL));
    });
  });

  describe('Backgrounds', () => {
    it('should not cause a state transition', () => {
      interpret('Background: foo');
      eq(machine.state, 'CaptureExplicitDocstringState');
    });

    it('should be captured', () => {
      interpret('Background: foo');

      const exported = featureBuilder.build();
      eq(exported.scenarios[0].steps[0].docstring, ['some docstring', 'Background: foo'].join(os.EOL));
    });
  });

  describe('Blank lines', () => {
    it('should not cause a state transition', () => {
      interpret('');
      eq(machine.state, 'CaptureExplicitDocstringState');
    });

    it('should be captured', () => {
      interpret('');

      const exported = featureBuilder.build();
      eq(exported.scenarios[0].steps[0].docstring, ['some docstring', ''].join(os.EOL));
    });
  });

  describe('Example tables', () => {
    it('should not cause a state transition', () => {
      interpret('Where:');
      eq(machine.state, 'CaptureExplicitDocstringState');
    });

    it('should be captured', () => {
      interpret('Where:');

      const exported = featureBuilder.build();
      eq(exported.scenarios[0].steps[0].docstring, ['some docstring', 'Where:'].join(os.EOL));
    });
  });

  describe('Explicit docstring delimiters', () => {
    it('should cause a transition to CaptureScenarioDetailsState', () => {
      interpret('---');
      eq(machine.state, 'CaptureScenarioDetailsState');
    });
  });

  describe('Implicit docstring delimiters', () => {
    it('should not cause a state transition', () => {
      interpret('   some more docstring');
      eq(machine.state, 'CaptureExplicitDocstringState');
    });

    it('should be captured', () => {
      interpret('   some more docstring');

      const exported = featureBuilder.build();
      eq(exported.scenarios[0].steps[0].docstring, ['some docstring', '   some more docstring'].join(os.EOL));
    });
  });

  describe('End of file', () => {
    it('should be unexpected', () => {
      throws(() => interpret('\u0000'), { message: `I did not expect the end of the feature at index.js:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('Features', () => {
    it('should not cause a state transition', () => {
      interpret('Feature: foo');
      eq(machine.state, 'CaptureExplicitDocstringState');
    });

    it('should be captured', () => {
      interpret('Feature: foo');

      const exported = featureBuilder.build();
      eq(exported.scenarios[0].steps[0].docstring, ['some docstring', 'Feature: foo'].join(os.EOL));
    });
  });

  describe('Block comment delimiters', () => {
    it('should not cause a state transition', () => {
      interpret('###');
      eq(machine.state, 'CaptureExplicitDocstringState');
    });

    it('should be captured', () => {
      interpret('###');

      const exported = featureBuilder.build();
      eq(exported.scenarios[0].steps[0].docstring, ['some docstring', '###'].join(os.EOL));
    });
  });

  describe('Single line comments', () => {
    it('should not cause a state transition', () => {
      interpret('# A comment');
      eq(machine.state, 'CaptureExplicitDocstringState');
    });

    it('should be captured', () => {
      interpret('# A comment');

      const exported = featureBuilder.build();
      eq(exported.scenarios[0].steps[0].docstring, ['some docstring', '# A comment'].join(os.EOL));
    });
  });

  describe('Scenarios', () => {
    it('should not cause a state transition', () => {
      interpret('Scenario: foo');
      eq(machine.state, 'CaptureExplicitDocstringState');
    });

    it('should be captured', () => {
      interpret('Scenario: foo');

      const exported = featureBuilder.build();
      eq(exported.scenarios[0].steps[0].docstring, ['some docstring', 'Scenario: foo'].join(os.EOL));
    });
  });

  describe('Lines of text', () => {
    it('should not cause a state transition', () => {
      interpret('some more text');
      eq(machine.state, 'CaptureExplicitDocstringState');
    });

    it('should be captured', () => {
      interpret('some more text');

      const exported = featureBuilder.build();
      eq(exported.scenarios[0].steps[0].docstring, ['some docstring', 'some more text'].join(os.EOL));
    });
  });

  function interpret(line, number = 1) {
    machine.interpret({ line, number });
  }
});
