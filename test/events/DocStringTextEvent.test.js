import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Session } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { DocStringTextEvent } = Events;

describe('DocStringTextEvent', () => {

  it('should test docstrings', () => {
    const session = new Session({ docstring: {} });
    const event = new DocStringTextEvent();

    eq(event.test({ line: 'some text' }, session), true);
    eq(event.test({ line: ' some text ' }, session), true);

    delete session.docstring;
    eq(event.test({ line: ' some text ' }, session), false);
  });

  it('should interpret docstrings', () => {
    const session = new Session({ docstring: {} });
    const event = new DocStringTextEvent();

    deq(event.interpret({ line: 'some text' }, session), { text: 'some text' });
    deq(event.interpret({ line: ' some text ' }, session), { text: ' some text ' });
  });
});
