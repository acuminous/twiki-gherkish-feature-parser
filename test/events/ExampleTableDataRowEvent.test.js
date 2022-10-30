import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Languages } from '../../lib/index.js';
import StubState from '../stubs/StubState.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { ExampleTableDataRowEvent } = Events;

describe('ExampleTableDataRowEvent', () => {

  it('should recognise example table data row', () => {
    const session = { language: Languages.English };
    const state = new StubState();
    const event = new ExampleTableDataRowEvent();

    eq(event.interpret({ line: '|a|' }, session, state), true);
    eq(event.interpret({ line: '| a |' }, session, state), true);
    eq(event.interpret({ line: '  |   a   |  ' }, session, state), true);
    eq(event.interpret({ line: '| abc |' }, session, state), true);
    eq(event.interpret({ line: '| a c |' }, session, state), true);
    eq(event.interpret({ line: '| a | b | c |' }, session, state), true);
    eq(event.interpret({ line: '| \u00A0a\u00A0 |' }, session, state), true);

    eq(event.interpret({ line: '|' }, session, state), false);
    eq(event.interpret({ line: '| |' }, session, state), false);
    eq(event.interpret({ line: '| a' }, session, state), false);
    eq(event.interpret({ line: '| a | b c | |' }, session, state), false);
    eq(event.interpret({ line: 'a |' }, session, state), false);
  });

  it('should handle example table data row', () => {
    const session = { language: Languages.English };
    const state = new StubState((event) => {
      eq(event.name, 'ExampleTableDataRowEvent');
      eq(event.source.line, '   |  a  | b c | d |  ');
      eq(event.source.number, 1);
      deq(event.data, { values: ['a', 'b c', 'd'] });
    });
    const event = new ExampleTableDataRowEvent();

    event.interpret({ line: '   |  a  | b c | d |  ', number: 1 }, session, state);

    eq(state.count, 1);
  });

  it('should not strip special whitespace', () => {
    const session = { language: Languages.English };
    const state = new StubState((event) => {
      eq(event.name, 'ExampleTableDataRowEvent');
      eq(event.source.line, '   | \u00A0a\u00A0 | \u00A0b c\u00A0 | \u00A0d\u00A0 |  ');
      eq(event.source.number, 1);
      deq(event.data, { values: ['\u00A0a\u00A0', '\u00A0b c\u00A0', '\u00A0d\u00A0'] });
    });
    const event = new ExampleTableDataRowEvent();

    event.interpret({ line: '   | \u00A0a\u00A0 | \u00A0b c\u00A0 | \u00A0d\u00A0 |  ', number: 1 }, session, state);

    eq(state.count, 1);
  });
});
