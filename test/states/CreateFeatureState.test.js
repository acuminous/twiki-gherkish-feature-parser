import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, States, Languages, utils } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { CreateFeatureState } = States;

describe('CreateFeatureState', () => {
  let featureBuilder;
  let machine;
  let state;
  let session;
  const expectedEvents = [
    ' - a background',
    ' - a blank line',
    ' - a block comment',
    ' - a scenario',
    ' - a single line comment',
    ' - an annotation',
    ' - some text',
  ].join('\n');

  beforeEach(() => {
    featureBuilder = new FeatureBuilder();
    featureBuilder.createFeature({ annotations: [], title: 'Meh' });

    machine = new StateMachine({ featureBuilder });
    machine.toCreateFeatureState();

    state = new CreateFeatureState({ featureBuilder, machine });

    session = { language: Languages.English };
  });

  describe('An annotation', () => {
    it('should not cause a state transition', () => {
      handle('@foo=bar');
      eq(machine.state, 'CreateFeatureState');
    });
  });

  describe('A background', () => {
    it('should cause a state transition to CreateBackgroundState', () => {
      handle('Background: foo');
      eq(machine.state, 'CreateBackgroundState');
    });

    it('should capture backgrounds with annotations', () => {
      handle('@one=1');
      handle('@two=2');
      handle('Background: First background');

      const exported = featureBuilder.build();
      eq(exported.background.annotations.length, 2);
      eq(exported.background.annotations[0].name, 'one');
      eq(exported.background.annotations[0].value, '1');
      eq(exported.background.annotations[1].name, 'two');
      eq(exported.background.annotations[1].value, '2');
    });
  });

  describe('A blank line', () => {
    it('should not cause a state transition', () => {
      handle('');
      eq(machine.state, 'CreateFeatureState');
    });
  });

  describe('An indented blank line', () => {
    it('should be unexpected on docstringIndentStart event', () => {
      session.indentation = 0;
      throws(() => handle('   some text'), { message: `I did not expect the start of an indented docstring at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('DocString Indent Stop Events', () => {
    it('should be unexpected on docstringIndentStop event', () => {
      session.docstring = { indentation: 3 };
      session.indentation = 0;
      throws(() => handle('some text'), { message: `I did not expect the end of an indented docstring at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('A docstring token', () => {
    it('should be unexpected on docstringTokenStart event', () => {
      throws(() => handle('---'), { message: `I did not expect the start of an explicit docstring at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
    });
  });

  describe('DocString Token Stop Events', () => {
    it('should be unexpected on docstringTokenStop event', () => {
      session.docstring = { token: '---' };
      throws(() => handle('---'), { message: `I did not expect the end of an explicit docstring at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
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

  describe('A block comment', () => {
    it('should cause a state transition to ConsumeBlockCommentState', () => {
      handle('###');
      eq(machine.state, 'ConsumeBlockCommentState');
    });
  });

  describe('A scenario', () => {
    it('should cause a state transition to CreateScenarioState', () => {
      handle('Scenario: First scenario');
      eq(machine.state, 'CreateScenarioState');
    });

    it('should be captured', () => {
      handle('Scenario: First scenario');

      const exported = featureBuilder.build();
      eq(exported.scenarios.length, 1);
      eq(exported.scenarios[0].title, 'First scenario');
    });

    it('should be captured with annotations', () => {
      handle('@one=1');
      handle('@two=2');
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

  describe('A single line comment', () => {
    it('should not cause a state transition', () => {
      handle('# Some comment');
      eq(machine.state, 'CreateFeatureState');
    });
  });

  describe('Text Events', () => {
    it('should not cause a state transition', () => {
      handle('some text');
      eq(machine.state, 'CreateFeatureState');
    });

    it('should capture description', () => {
      handle('some text');
      handle('Some more text');

      const exported = featureBuilder.build();
      eq(exported.description, 'some text\nSome more text');
    });
  });

  function handle(line, number = 1, indentation = utils.getIndentation(line)) {
    state.handle({ line, number, indentation }, session);
  }
});
