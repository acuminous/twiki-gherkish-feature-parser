import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import os from 'node:os';
import zunit from 'zunit';
import { FeatureBuilder, StateMachine, Session, utils } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('DeclareExplicitDocstringState', () => {
  let machine;

  describe('Background Steps', () => {

    const expectedEvents = [
      ' - a docstring line',
    ].join('\n');

    beforeEach(() => {
      const featureBuilder = new FeatureBuilder()
        .createFeature({ title: 'Meh' })
        .createBackground({ title: 'Meh' })
        .createStep({ text: 'Meh' });

      const session = new Session({ docstring: { token: '---', indentation: 3 } });

      machine = new StateMachine({ featureBuilder, session }, true)
        .toInitialState()
        .toDeclareFeatureState()
        .checkpoint()
        .toDeclareBackgroundState()
        .toCaptureBackgroundDetailsState()
        .checkpoint()
        .toCaptureStepState()
        .toDeclareExplicitDocstringState();
    });

    describe('A blank line', () => {
      it('should cause a transition to CaptureExplicitDocstringState', () => {
        interpret('   ');
        eq(machine.state, 'CaptureExplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('   ');

        const exported = machine.build();
        eq(exported.background.steps[0].docstring, '');
      });

      it('should be trimmed', () => {
        interpret('      ');

        const exported = machine.build();
        eq(exported.background.steps[0].docstring, '   ');
      });
    });

    describe('A docstring token', () => {
      it('should be unexpected', () => {
        throws(() => interpret('   ---'), { message: `I did not expect the end of an explicit docstring at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
      });
    });

    describe('The end of the feature', () => {
      it('should be unexpected', () => {
        throws(() => interpret('\u0000'), { message: `I did not expect the end of the feature at undefined:1\nInstead, I expected one of:\n${expectedEvents}\n` });
      });
    });

    describe('A line of text', () => {
      it('should cause a transition to CaptureExplicitDocstringState', () => {
        interpret('   some text');
        eq(machine.state, 'CaptureExplicitDocstringState');
      });

      it('should be captured', () => {
        interpret('   some text');
        interpret('      some more text');

        const exported = machine.build();
        eq(exported.background.steps[0].docstring, ['some text', '   some more text'].join(os.EOL));
      });
    });
  });

  function interpret(line, number = 1, indentation = utils.getIndentation(line)) {
    machine.interpret({ line, number, indentation });
  }
});
