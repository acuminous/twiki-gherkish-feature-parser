import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq, ok } from 'node:assert';
import { Events, Session, Source } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { ImplicitDocstringStartEvent } = Events;

describe('ImplicitDocstringStartEvent', () => {

  it('should recognise indented text', () => {
    const session = new Session();
    const event = new ImplicitDocstringStartEvent();

    eq(event.test(new Source({ line: ' some text', indentation: 1 }), session), true);
  });

  it('should not recognise flat text', () => {
    const session = new Session();
    const event = new ImplicitDocstringStartEvent();

    eq(event.test(new Source({ line: 'some text', indentation: 0 }), session), false);
  });

  it('should not recognise indented docstrings when already handling an implicit docstring', () => {
    const session = new Session().beginImplicitDocstring(1);
    const event = new ImplicitDocstringStartEvent();

    eq(event.test(new Source({ line: ' some text', indentation: 1 }), session), false);
  });

  it('should not recognise indented docstrings when already handling an explicit docstring', () => {
    const session = new Session().beginExplicitDocstring('---');
    const event = new ImplicitDocstringStartEvent();

    eq(event.test(new Source({ line: ' some text', indentation: 1 }), session), false);
  });

  it('should interpret indented text', () => {
    const session = new Session();
    const event = new ImplicitDocstringStartEvent();

    deq(event.interpret(new Source({ line: ' some text', indentation: 1 }), session), { text: 'some text' });
    ok(session.isProcessingImplicitDocstring());
  });
});
