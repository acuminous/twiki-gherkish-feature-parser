import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Session } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { ImplicitDocStringStartEvent } = Events;

describe('ImplicitDocStringStartEvent', () => {

  it('should recognise indented text', () => {
    const session = new Session();
    const event = new ImplicitDocStringStartEvent();

    eq(event.test({ line: ' some text', indentation: 1 }, session), true);
  });

  it('should not recognise flat text', () => {
    const session = new Session();
    const event = new ImplicitDocStringStartEvent();

    eq(event.test({ line: 'some text', indentation: 0 }, session), false);
  });

  it('should not recognise indented docstrings when already handling an implicit docstring', () => {
    const session = new Session({ docstring: {} });
    const event = new ImplicitDocStringStartEvent();

    eq(event.test({ line: ' some text', indentation: 1 }, session), false);
  });

  it('should not recognise indented docstrings when already handling an explicit docstring', () => {
    const session = new Session({ docstring: { token: '---' } });
    const event = new ImplicitDocStringStartEvent();

    eq(event.test({ line: ' some text', indentation: 1 }, session), false);
  });

  it('should interpret indented text', () => {
    const session = new Session();
    const event = new ImplicitDocStringStartEvent();

    deq(event.interpret({ line: ' some text', indentation: 1 }, session), { text: 'some text' });
    eq(session.docstring.indentation, 1);
  });
});
