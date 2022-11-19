import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Session } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { ExampleTableSeparatorRowEvent } = Events;

describe('ExampleTableSeparatorRowEvent', () => {

  it('should test example table separator row', () => {
    const event = new ExampleTableSeparatorRowEvent();
    const session = new Session().countExampleHeadings(['a']);

    eq(event.test({ line: '|-|' }, session), true);
    eq(event.test({ line: '  |-|  ' }, session), true);
    eq(event.test({ line: '|---|' }, session), true);

    session.countExampleHeadings(['a', 'b', 'c']);
    eq(event.test({ line: '|---|-|---|' }, session), true);

    eq(event.test({ line: '|---|---|' }, session), false);
    eq(event.test({ line: '|---|---|---|---|' }, session), false);
    eq(event.test({ line: '|' }, session), false);
    eq(event.test({ line: '| - |' }, session), false);
    eq(event.test({ line: '|- -|' }, session), false);
    eq(event.test({ line: '---|---' }, session), false);
  });

  it('should interpret example table separator row', () => {
    const event = new ExampleTableSeparatorRowEvent();
    const session = new Session().countExampleHeadings(['a']);

    eq(event.interpret({ line: '|-|' }, session), undefined);
    eq(event.interpret({ line: '  |-|  ' }, session), undefined);
    eq(event.interpret({ line: '|---|' }, session), undefined);

    session.countExampleHeadings(['a', 'b', 'c']);
    eq(event.interpret({ line: '|---|-|---|' }, session), undefined);
  });
});
