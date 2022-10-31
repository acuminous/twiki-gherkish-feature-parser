import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { ExampleTableSeparatorRowEvent } = Events;

describe('ExampleTableSeparatorRowEvent', () => {

  it('should test example table separator row', () => {
    const event = new ExampleTableSeparatorRowEvent();

    eq(event.test({ line: '|-|' }), true);
    eq(event.test({ line: '  |-|  ' }), true);
    eq(event.test({ line: '|---|' }), true);
    eq(event.test({ line: '|---|-|---|' }), true);

    eq(event.test({ line: '|' }), false);
    eq(event.test({ line: '| - |' }), false);
    eq(event.test({ line: '|- -|' }), false);
    eq(event.test({ line: '---|---' }), false);
  });

  it('should interpret example table separator row', () => {
    const event = new ExampleTableSeparatorRowEvent();

    deq(event.interpret({ line: '|-|' }), {});
    deq(event.interpret({ line: '  |-|  ' }), {});
    deq(event.interpret({ line: '|---|' }), {});
    deq(event.interpret({ line: '|---|-|---|' }), {});
  });
});
