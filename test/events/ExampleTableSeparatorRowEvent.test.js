import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import { Events, Session, Source } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { ExampleTableSeparatorRowEvent } = Events;

describe('ExampleTableSeparatorRowEvent', () => {

  it('should test example table separator row', () => {
    const event = new ExampleTableSeparatorRowEvent();

    eq(event.test(new Source({ line: '|-|' })), true);
    eq(event.test(new Source({ line: '  |-|  ' })), true);
    eq(event.test(new Source({ line: '|---|' })), true);
    eq(event.test(new Source({ line: '|---|-|---|' })), true);

    eq(event.test(new Source({ line: '|' })), false);
    eq(event.test(new Source({ line: '| - |' })), false);
    eq(event.test(new Source({ line: '|- -|' })), false);
    eq(event.test(new Source({ line: '---|---' })), false);
  });

  it('should interpret example table separator row', () => {
    const event = new ExampleTableSeparatorRowEvent();
    const session = new Session().countExampleHeadings(['a']);

    eq(event.interpret(new Source({ line: '|-|' }), session), undefined);
    eq(event.interpret(new Source({ line: '  |-|  ' }), session), undefined);
    eq(event.interpret(new Source({ line: '|---|' }), session), undefined);

    session.countExampleHeadings(['a', 'b', 'c']);
    eq(event.interpret(new Source({ line: '|---|-|---|' }), session), undefined);
  });

  it('should report incorrect number of columns', () => {
    const event = new ExampleTableSeparatorRowEvent();
    const session = new Session().countExampleHeadings(['a']);
    const source = new Source({ line: '|---|---|---|', lineNumber: 11, uri: 'invalid.feature' });

    throws(() => {
      event.interpret(source, session);
    }, (err) => {
      eq(err.message, 'Expected 1 columns but found 3 at invalid.feature:11');
      return true;
    });
  });
});
