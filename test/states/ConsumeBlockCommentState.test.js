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
    .shouldNotCheckpoint()
    .shouldNotTransition();

  testBuilder.interpreting('Background:')
    .shouldNotCheckpoint()
    .shouldNotTransition();

  testBuilder.interpreting('')
    .shouldNotCheckpoint()
    .shouldNotTransition();

  testBuilder.interpreting('Where:')
    .shouldNotCheckpoint()
    .shouldNotTransition();

  testBuilder.interpreting('---')
    .shouldNotCheckpoint()
    .shouldNotTransition();

  testBuilder.interpreting('\u0000')
    .shouldBeUnexpected('the end of the feature');

  testBuilder.interpreting('Feature:')
    .shouldNotCheckpoint()
    .shouldNotTransition();

  testBuilder.interpreting('Rule:')
    .shouldNotCheckpoint()
    .shouldNotTransition();

  testBuilder.interpreting('Scenario:')
    .shouldNotCheckpoint()
    .shouldNotTransition();

  testBuilder.interpreting('# some comment')
    .shouldNotCheckpoint()
    .shouldNotTransition();

  testBuilder.interpreting('###')
    .shouldNotCheckpoint()
    .shouldUnwind();

  testBuilder.interpreting('some text')
    .shouldNotCheckpoint()
    .shouldNotTransition();

  testBuilder.interpreting('   some text')
    .shouldNotCheckpoint()
    .shouldNotTransition();
});
