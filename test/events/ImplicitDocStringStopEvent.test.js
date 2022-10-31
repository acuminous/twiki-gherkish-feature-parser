import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Session } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { ImplicitDocStringStopEvent } = Events;

describe('ImplicitDocStringStopEvent', () => {

  it('should recognise flat text', () => {
    const session = new Session({ docstring: { indentation: 3 } });
    const event = new ImplicitDocStringStopEvent();

    eq(event.test({ line: 'some text', indentation: 0 }, session), true);
  });

  it('should recognise end of feature', () => {
    const session = new Session({ docstring: { indentation: 3 } });
    const event = new ImplicitDocStringStopEvent();

    eq(event.test({ line: '\u0000' }, session), true);
  });

  it('should not recognise indented text', () => {
    const session = new Session({ docstring: { indentation: 3 } });
    const event = new ImplicitDocStringStopEvent();

    eq(event.test({ line: '   some text', indentation: 3 }, session), false);
  });

  it('should not recognise indented text when not processing an implicit docstring', () => {
    const session = new Session();
    const event = new ImplicitDocStringStopEvent();

    eq(event.test({ line: '   some text', indentation: 3 }, session), false);
  });

  it('should not recognise indented text when not processing an explicit docstring', () => {
    const session = new Session({ docstring: { token: '---' } });
    const event = new ImplicitDocStringStopEvent();

    eq(event.test({ line: '   some text', indentation: 3 }, session), false);
  });

  it('should interpret flat text', () => {
    const session = new Session({ docstring: { indentation: 3 } });
    const event = new ImplicitDocStringStopEvent();

    deq(event.interpret({ line: 'some text', indentation: 0 }, session), {});
    eq(session.isProcessingDocString(), false);
  });
});
