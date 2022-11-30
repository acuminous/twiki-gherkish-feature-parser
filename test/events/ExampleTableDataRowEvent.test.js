import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import { Events, Session, Source } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { ExampleTableDataRowEvent } = Events;

describe('ExampleTableDataRowEvent', () => {

  it('should test example table data row', () => {
    const event = new ExampleTableDataRowEvent();

    eq(event.test(new Source({ line: '|a|' })), true);
    eq(event.test(new Source({ line: '| a |' })), true);
    eq(event.test(new Source({ line: '  |   a   |  ' })), true);
    eq(event.test(new Source({ line: '| abc |' })), true);
    eq(event.test(new Source({ line: '| a c |' })), true);
    eq(event.test(new Source({ line: '| a | b | c |' })), true);
    eq(event.test(new Source({ line: '| a | b \\| c | d |' })), true);
    eq(event.test(new Source({ line: '| \u00A0a\u00A0 |' })), true);

    eq(event.test(new Source({ line: '|' })), false);
    eq(event.test(new Source({ line: '| |' })), false);
    eq(event.test(new Source({ line: '| a' })), false);
    eq(event.test(new Source({ line: '| a | b c | |' })), false);
    eq(event.test(new Source({ line: 'a |' })), false);
  });

  it('should interpret example table data row', () => {
    const event = new ExampleTableDataRowEvent();
    const session = new Session().countExampleHeadings(['a']);

    deq(event.interpret(new Source({ line: '|a|' }), session), { examples: ['a'] });
    deq(event.interpret(new Source({ line: '| a |' }), session), { examples: ['a'] });
    deq(event.interpret(new Source({ line: '  |   a   |  ' }), session), { examples: ['a'] });
    deq(event.interpret(new Source({ line: '| abc |' }), session), { examples: ['abc'] });
    deq(event.interpret(new Source({ line: '| a c |' }), session), { examples: ['a c'] });
    deq(event.interpret(new Source({ line: '| \u00A0a\u00A0 |' }), session), { examples: ['\u00A0a\u00A0'] });

    session.countExampleHeadings(['a', 'b', 'c']);
    deq(event.interpret(new Source({ line: '| a | b | c |' }), session), { examples: ['a', 'b', 'c'] });
    deq(event.interpret(new Source({ line: '| a | b \\| c | d |' }), session), { examples: ['a', 'b \\| c', 'd'] });
  });

  it('should report incorrect number of examples', () => {
    const event = new ExampleTableDataRowEvent();
    const session = new Session().countExampleHeadings(['a']);
    const source = new Source({ line: '| a | b | c |', lineNumber: 11, uri: 'invalid.feature' });

    throws(() => {
      event.interpret(source, session);
    }, (err) => {
      eq(err.message, 'Expected 1 examples but found 3 at invalid.feature:11');
      return true;
    });
  });
});
