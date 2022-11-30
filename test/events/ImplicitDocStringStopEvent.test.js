import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Session, Source } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { ImplicitDocstringStopEvent } = Events;

describe('ImplicitDocstringStopEvent', () => {

  it('should recognise flat text', () => {
    const session = new Session({ docstring: { indentation: 3 } });
    const event = new ImplicitDocstringStopEvent();

    eq(event.test(new Source({ line: 'some text', indentation: 0 }), session), true);
  });

  it('should recognise end of feature', () => {
    const session = new Session({ docstring: { indentation: 3 } });
    const event = new ImplicitDocstringStopEvent();

    eq(event.test(new Source({ line: '\u0000' }), session), true);
  });

  it('should recognise a completely blank line', () => {
    const session = new Session({ docstring: { indentation: 3 } });
    const event = new ImplicitDocstringStopEvent();

    eq(event.test(new Source({ line: '', indentation: 0 }), session), true);
  });

  it('should not recognise indented text', () => {
    const session = new Session({ docstring: { indentation: 3 } });
    const event = new ImplicitDocstringStopEvent();

    eq(event.test(new Source({ line: '   some text', indentation: 3 }), session), false);
  });

  it('should not recognise indented text when not processing an implicit docstring', () => {
    const session = new Session();
    const event = new ImplicitDocstringStopEvent();

    eq(event.test(new Source({ line: '   some text', indentation: 3 }), session), false);
  });

  it('should not recognise indented text when not processing an explicit docstring', () => {
    const session = new Session({ docstring: { delimiter: '---' } });
    const event = new ImplicitDocstringStopEvent();

    eq(event.test(new Source({ line: '   some text', indentation: 3 }), session), false);
  });

  it('should interpret flat text', () => {
    const session = new Session({ docstring: { indentation: 3 } });
    const event = new ImplicitDocstringStopEvent();

    eq(event.interpret(new Source({ line: 'some text', indentation: 0 }), session), undefined);
    eq(session.isProcessingDocstring(), false);
  });
});
