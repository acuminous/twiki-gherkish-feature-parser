import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, utils } from '../../lib/index.js';
import StubSession from '../stubs/StubSession.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('CaptureScenarioStepState', () => {
  let featureBuilder;
  let machine;

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
    featureBuilder = new FeatureBuilder()
      .createFeature({ title: 'Meh' })
      .createScenario({ title: 'First scenario' })
      .createStep({ text: 'First step' });

    const session = new StubSession();

    machine = new StateMachine({ featureBuilder, session })
      .toDeclareFeatureState()
      .checkpoint()
      .toDeclareScenarioState()
      .toCaptureScenarioDetailsState()
      .checkpoint()
      .toCaptureScenarioStepState();
  });

  describe('Annotations', () => {
    it('should cause a transition to CaptureAnnotationState', () => {
      interpret('@foo=bar');
      eq(machine.state, 'CaptureAnnotationState');
    });
  });

  describe('Backgrounds', () => {
    it('should be unexpected', () => {
      throws(() => interpret('Background: Meh'), { message: `I did not expect a background at index.js:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('Blank lines', () => {
    it('should not cause a state transition', () => {
      interpret('');
      eq(machine.state, 'CaptureScenarioStepState');
    });
  });

  describe('Block comment delimiters', () => {
    it('should cause a transition to BlockCommentState', () => {
      interpret('###');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  describe('Example tables', () => {
    it('should cause a transition to DeclareExampleTableState', () => {
      interpret('Where:');
      eq(machine.state, 'DeclareExampleTableState');
    });
  });

  describe('Explicit docstring delimiters', () => {
    it('should cause a transition to BeginExplicitDocstringState', () => {
      interpret('---');
      eq(machine.state, 'BeginExplicitDocstringState');
    });
  });

  describe('Implicit docstring delimiters', () => {
    it('should cause a transition to CaptureImplicitDocstringState', () => {
      interpret('   some docstring');
      eq(machine.state, 'CaptureImplicitDocstringState');
    });

    it('should be captured', () => {
      interpret('   some text');

      const exported = featureBuilder.build();
      eq(exported.scenarios[0].steps[0].docstring, 'some text');
    });
  });

  describe('End of file', () => {
    it('should cause a transition to FinalState', () => {
      interpret('\u0000');
      eq(machine.state, 'FinalState');
    });
  });

  describe('Features', () => {
    it('should be unexpected', () => {
      throws(() => interpret('Feature: Meh'), { message: `I did not expect a feature at index.js:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('Single line comments', () => {
    it('should not cause a state transition', () => {
      interpret('#');
      eq(machine.state, 'CaptureScenarioStepState');
    });
  });

  describe('Scenarios', () => {
    it('should cause a transition to DeclareScenarioState', () => {
      interpret('Scenario: foo');
      eq(machine.state, 'DeclareScenarioState');
    });

    it('should be captured without annotations', () => {
      interpret('Scenario: Second scenario');

      const exported = featureBuilder.build();
      eq(exported.scenarios.length, 2);
      eq(exported.scenarios[0].title, 'First scenario');
      eq(exported.scenarios[1].title, 'Second scenario');
    });

    it('should be captured with annotations', () => {
      interpret('@one=1');
      interpret('@two=2');
      interpret('Scenario: Second scenario');

      const exported = featureBuilder.build();
      eq(exported.scenarios.length, 2);
      eq(exported.scenarios[1].annotations.length, 2);
      eq(exported.scenarios[1].annotations[0].name, 'one');
      eq(exported.scenarios[1].annotations[0].value, '1');
      eq(exported.scenarios[1].annotations[1].name, 'two');
      eq(exported.scenarios[1].annotations[1].value, '2');
    });
  });

  describe('Lines of text', () => {
    it('should cause a transition to CaptureScenarioStepState', () => {
      interpret('Second step');
      eq(machine.state, 'CaptureScenarioStepState');
    });

    it('should be captured without annotations', () => {
      interpret('Second step');

      const exported = featureBuilder.build();

      eq(exported.scenarios[0].steps.length, 2);
      eq(exported.scenarios[0].steps[1].text, 'Second step');
    });

    it('should be captured with annotations', () => {
      interpret('@one=1');
      interpret('@two=2');
      interpret('Bah');

      const exported = featureBuilder.build();
      eq(exported.scenarios[0].steps[1].annotations.length, 2);
      deq(exported.scenarios[0].steps[1].annotations[0], { name: 'one', value: '1' });
      deq(exported.scenarios[0].steps[1].annotations[1], { name: 'two', value: '2' });
    });

    it('should append to existing steps', () => {
      interpret('Second step');
      interpret('Third step');

      const exported = featureBuilder.build();
      eq(exported.scenarios[0].steps.length, 3);
      eq(exported.scenarios[0].steps[0].text, 'First step');
      eq(exported.scenarios[0].steps[1].text, 'Second step');
      eq(exported.scenarios[0].steps[2].text, 'Third step');
    });
  });

  function interpret(line, number = 1, indentation = utils.getIndentation(line)) {
    machine.interpret({ line, number, indentation });
  }
});
