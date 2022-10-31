import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { ExampleTableDataRowEvent } = Events;

describe('ExampleTableDataRowEvent', () => {

  it('should test example table data row', () => {
    const event = new ExampleTableDataRowEvent();

    eq(event.test({ line: '|a|' }), true);
    eq(event.test({ line: '| a |' }), true);
    eq(event.test({ line: '  |   a   |  ' }), true);
    eq(event.test({ line: '| abc |' }), true);
    eq(event.test({ line: '| a c |' }), true);
    eq(event.test({ line: '| a | b | c |' }), true);
    eq(event.test({ line: '| \u00A0a\u00A0 |' }), true);

    eq(event.test({ line: '|' }), false);
    eq(event.test({ line: '| |' }), false);
    eq(event.test({ line: '| a' }), false);
    eq(event.test({ line: '| a | b c | |' }), false);
    eq(event.test({ line: 'a |' }), false);
  });

  it('should interpret example table data row', () => {
    const event = new ExampleTableDataRowEvent();

    deq(event.interpret({ line: '|a|' }), { values: ['a'] });
    deq(event.interpret({ line: '| a |' }), { values: ['a'] });
    deq(event.interpret({ line: '  |   a   |  ' }), { values: ['a'] });
    deq(event.interpret({ line: '| abc |' }), { values: ['abc'] });
    deq(event.interpret({ line: '| a c |' }), { values: ['a c'] });
    deq(event.interpret({ line: '| a | b | c |' }), { values: ['a', 'b', 'c'] });
    deq(event.interpret({ line: '| \u00A0a\u00A0 |' }), { values: ['\u00A0a\u00A0'] });
  });
});
