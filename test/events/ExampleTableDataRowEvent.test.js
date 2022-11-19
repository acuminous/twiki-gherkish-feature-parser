import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import { Events, Session } from '../../lib/index.js';

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
    const session = new Session().countExampleHeadings(['a']);

    deq(event.interpret({ line: '|a|' }, session), { values: ['a'] });
    deq(event.interpret({ line: '| a |' }, session), { values: ['a'] });
    deq(event.interpret({ line: '  |   a   |  ' }, session), { values: ['a'] });
    deq(event.interpret({ line: '| abc |' }, session), { values: ['abc'] });
    deq(event.interpret({ line: '| a c |' }, session), { values: ['a c'] });
    deq(event.interpret({ line: '| \u00A0a\u00A0 |' }, session), { values: ['\u00A0a\u00A0'] });

    session.countExampleHeadings(['a', 'b', 'c']);
    deq(event.interpret({ line: '| a | b | c |' }, session), { values: ['a', 'b', 'c'] });
  });

  it('should report incorrect number of examples', () => {
    const event = new ExampleTableDataRowEvent();
    const session = new Session({
      metadata: {
        source: {
          uri: 'invalid.feature',
        },
      },
    }).countExampleHeadings(['a']);

    throws(() => {
      event.interpret({ line: '| a | b | c |', number: 11 }, session);
    }, (err) => {
      eq(err.message, 'Expected 1 examples but found 3 at invalid.feature:11');
      return true;
    });
  });
});
