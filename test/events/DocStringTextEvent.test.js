import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Session } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { DocstringTextEvent } = Events;

describe('DocstringTextEvent', () => {

  it('should test docstrings', () => {
    const session = new Session({ docstring: {} });
    const event = new DocstringTextEvent();

    eq(event.test({ line: 'some text' }, session), true);
    eq(event.test({ line: ' some text ' }, session), true);

    delete session.docstring;
    eq(event.test({ line: ' some text ' }, session), false);
  });

  it('should interpret docstrings', () => {
    const session = new Session({ docstring: {} });
    const event = new DocstringTextEvent();

    deq(event.interpret({ line: 'some text' }, session), { text: 'some text' });
    deq(event.interpret({ line: ' some text ' }, session), { text: ' some text ' });
  });
});
