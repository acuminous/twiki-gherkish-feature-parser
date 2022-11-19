import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { StateMachine, Events } from '../../lib/index.js';
import StubSession from '../stubs/StubSession.js';
import StateMachineTestBuilder from './StateMachineTestBuilder.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('ConsumeBlockCommentState', () => {

  const testBuilder = new StateMachineTestBuilder().beforeEach(() => {
    const session = new StubSession();
    const machine = new StateMachine({ session })
      .toStubState()
      .checkpoint()
      .toConsumeBlockCommentState();

    testBuilder.machine = machine;
    testBuilder.expectedEvents = [
      Events.BlockCommentDelimiterEvent,
      Events.TextEvent,
    ];
  });

  testBuilder.interpreting('@foo=bar')
    .shouldNotTransition();

  testBuilder.interpreting('Background:')
    .shouldNotTransition();

  testBuilder.interpreting('')
    .shouldNotTransition();

  testBuilder.interpreting('Where:')
    .shouldNotTransition();

  testBuilder.interpreting('---')
    .shouldNotTransition();

  testBuilder.interpreting('\u0000')
    .shouldBeUnexpected('the end of the feature');

  testBuilder.interpreting('Feature:')
    .shouldNotTransition();

  testBuilder.interpreting('Rule:')
    .shouldNotTransition();

  testBuilder.interpreting('Scenario:')
    .shouldNotTransition();

  testBuilder.interpreting('# some comment')
    .shouldNotTransition();

  testBuilder.interpreting('###')
    .shouldUnwind();

  testBuilder.interpreting('some text')
    .shouldNotTransition();

  testBuilder.interpreting('   some text')
    .shouldNotTransition();

});

//   let featureBuilder;
//   let machine;
//   const expectedEvents = [
//     ' - a block comment delimiter',
//     ' - some text',
//   ].join('\n');

//   beforeEach(() => {
//     featureBuilder = new FeatureBuilder();
//     const session = new StubSession();

//     machine = new StateMachine({ featureBuilder, session })
//       .toDeclareFeatureState()
//       .checkpoint()
//       .toConsumeBlockCommentState();
//   });

//   describe('Annotations', () => {
//     it('should not cause a state transition', () => {
//       interpret('@foo = bar');
//       eq(machine.state, 'ConsumeBlockCommentState');
//     });
//   });

//   describe('Backgrounds', () => {
//     it('should not cause a state transition', () => {
//       interpret('Background: foo');
//       eq(machine.state, 'ConsumeBlockCommentState');
//     });
//   });

//   describe('Blank lines', () => {
//     it('should not cause a state transition', () => {
//       interpret('');
//       eq(machine.state, 'ConsumeBlockCommentState');
//     });
//   });

//   describe('Example tables', () => {
//     it('should not cause a state transition', () => {
//       interpret('Where:');
//       eq(machine.state, 'ConsumeBlockCommentState');
//     });
//   });

//   describe('Explicit docstring delimiters', () => {
//     it('should not cause a state transition', () => {
//       interpret('---');
//       eq(machine.state, 'ConsumeBlockCommentState');
//     });
//   });

//   describe('Implicit docstring delimiters', () => {
//     it('should not cause a state transition', () => {
//       interpret('   some docstring');
//       eq(machine.state, 'ConsumeBlockCommentState');
//     });
//   });

//   describe('End of file', () => {
//     it('should be unexpected', () => {
//       throws(() => interpret('\u0000'), { message: `I did not expect the end of the feature at index.js:1\nInstead, I expected one of:\n${expectedEvents}\n` });
//     });
//   });

//   describe('Features', () => {
//     it('should not cause a state transition', () => {
//       interpret('Feature: foo');
//       eq(machine.state, 'ConsumeBlockCommentState');
//     });
//   });

//   describe('Block comment delimiters', () => {
//     it('should cause a transition to the previous state', () => {
//       interpret('###');
//       eq(machine.state, 'DeclareFeatureState');
//     });
//   });

//   describe('Single line comments', () => {
//     it('should not cause a state transition', () => {
//       interpret('# Single comment');
//       eq(machine.state, 'ConsumeBlockCommentState');
//     });
//   });

//   describe('Scenarios', () => {
//     it('should not cause a state transition', () => {
//       interpret('Scenario: foo');
//       eq(machine.state, 'ConsumeBlockCommentState');
//     });
//   });

//   describe('Lines of text', () => {
//     it('should not cause a state transition', () => {
//       interpret('Given some text');
//       eq(machine.state, 'ConsumeBlockCommentState');
//     });
//   });

//   function interpret(line, number = 1) {
//     machine.interpret({ line, number });
//   }
// });
