import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Languages } from '../../lib/index.js';
import StubState from '../stubs/StubState.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { ExampleTableHeaderRowEvent } = Events;

describe('ExampleTableHeaderRowEvent', () => {

  it('should recognise example table header row', () => {
    const session = { language: Languages.English };
    const state = new StubState();
    const event = new ExampleTableHeaderRowEvent();

    eq(event.interpret({ line: '| a |' }, session, state), true);
    eq(event.interpret({ line: '  | a |  ' }, session, state), true);
    eq(event.interpret({ line: '|   a   |' }, session, state), true);
    eq(event.interpret({ line: '| a | b | c |' }, session, state), true);
    eq(event.interpret({ line: '| abc |' }, session, state), true);
    eq(event.interpret({ line: '| a b c |' }, session, state), true);

    eq(event.interpret({ line: '|' }, session, state), false);
    eq(event.interpret({ line: '| a' }, session, state), false);
    eq(event.interpret({ line: '| a | b' }, session, state), false);
    eq(event.interpret({ line: 'a | b' }, session, state), false);
  });

  it('should handle single column example table header row', () => {
    const session = { language: Languages.English };
    const state = new StubState((event, context) => {
      eq(event.name, 'ExampleTableHeaderRowEvent');
      eq(context.source.line, '| a |');
      eq(context.source.number, 1);
      deq(context.data.headings, ['a']);
    });
    const event = new ExampleTableHeaderRowEvent();

    event.interpret({ line: '| a |', number: 1 }, session, state);

    eq(state.count, 1);
  });

  it('should handle multi column example table header row', () => {
    const session = { language: Languages.English };
    const state = new StubState((event, context) => {
      eq(event.name, 'ExampleTableHeaderRowEvent');
      eq(context.source.line, '| a | b | cde |');
      eq(context.source.number, 1);
      deq(context.data.headings, ['a', 'b', 'cde']);
    });
    const event = new ExampleTableHeaderRowEvent();

    event.interpret({ line: '| a | b | cde |', number: 1 }, session, state);

    eq(state.count, 1);
  });
});
