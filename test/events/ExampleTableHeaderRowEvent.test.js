import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Session, Source } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { ExampleTableHeaderRowEvent } = Events;

describe('ExampleTableHeaderRowEvent', () => {

  it('should test example table header row', () => {
    const event = new ExampleTableHeaderRowEvent();

    eq(event.test(new Source({ line: '| a |' })), true);
    eq(event.test(new Source({ line: '  | a |  ' })), true);
    eq(event.test(new Source({ line: '|   a   |' })), true);
    eq(event.test(new Source({ line: '| a | b | c |' })), true);
    eq(event.test(new Source({ line: '| abc |' })), true);
    eq(event.test(new Source({ line: '| a b c |' })), true);

    eq(event.test(new Source({ line: '|' })), false);
    eq(event.test(new Source({ line: '| a' })), false);
    eq(event.test(new Source({ line: '| a | b' })), false);
    eq(event.test(new Source({ line: 'a | b' })), false);
  });

  it('should interpret example table header row', () => {
    const session = new Session();
    const event = new ExampleTableHeaderRowEvent();

    deq(event.interpret(new Source({ line: '| a |' }), session), { headings: ['a'] });
    deq(event.interpret(new Source({ line: '  | a |  ' }), session), { headings: ['a'] });
    deq(event.interpret(new Source({ line: '|   a   |' }), session), { headings: ['a'] });
    deq(event.interpret(new Source({ line: '| a | b | c |' }), session), { headings: ['a', 'b', 'c'] });
    deq(event.interpret(new Source({ line: '| abc |' }), session), { headings: ['abc'] });
    deq(event.interpret(new Source({ line: '| a b c |' }), session), { headings: ['a b c'] });
  });

  it('should count the number of examples required', () => {
    const session = new Session();
    const event = new ExampleTableHeaderRowEvent();

    event.interpret(new Source({ line: '| a |' }), session);
    eq(session.numberOfExamples, 1);

    event.interpret(new Source({ line: '| a | b | c |' }), session);
    eq(session.numberOfExamples, 3);
  });
});
