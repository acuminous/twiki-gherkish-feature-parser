import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Languages } from '../../lib/index.js';
import StubState from '../stubs/StubState.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { ExampleTableSeparatorRowEvent } = Events;

describe('ExampleTableSeparatorRowEvent', () => {

  it('should recognise example table separator row', () => {
    const session = { language: Languages.English };
    const state = new StubState();
    const event = new ExampleTableSeparatorRowEvent();

    eq(event.handle({ line: '|-|' }, session, state), true);
    eq(event.handle({ line: '  |-|  ' }, session, state), true);
    eq(event.handle({ line: '|---|' }, session, state), true);
    eq(event.handle({ line: '|---|-|---|' }, session, state), true);

    eq(event.handle({ line: '|' }, session, state), false);
    eq(event.handle({ line: '| - |' }, session, state), false);
    eq(event.handle({ line: '|- -|' }, session, state), false);
    eq(event.handle({ line: '---|---' }, session, state), false);
  });

  it('should handle example table separator row', () => {
    const session = { language: Languages.English };
    const state = new StubState((event) => {
      eq(event.name, 'ExampleTableSeparatorRowEvent');
      eq(event.source.line, '   |---|---|---|');
      eq(event.source.number, 1);
      deq(event.data, {});
    });
    const event = new ExampleTableSeparatorRowEvent();

    event.handle({ line: '   |---|---|---|', number: 1 }, session, state);

    eq(state.count, 1);
  });
});
