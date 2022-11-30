import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Session, Source } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { ExplicitDocstringStopEvent } = Events;

describe('ExplicitDocstringStopEvent', () => {

  it('should test explicit --- docstrings', () => {
    const session = new Session().beginExplicitDocstring('---');
    const event = new ExplicitDocstringStopEvent();

    eq(event.test(new Source({ line: '---' }), session), true);
    eq(event.test(new Source({ line: ' --- ' }), session), true);

    eq(event.test(new Source({ line: '-' }), session), false);
    eq(event.test(new Source({ line: '--' }), session), false);
    eq(event.test(new Source({ line: '--- not a doc string' }), session), false);
    eq(event.test(new Source({ line: '----' }), session), false);

    eq(event.test(new Source({ line: '"""' }), session), false);
  });

  it('should test explicit """ docstrings', () => {
    const session = new Session().beginExplicitDocstring('"""');
    const event = new ExplicitDocstringStopEvent();

    eq(event.test(new Source({ line: '"""' }), session), true);
    eq(event.test(new Source({ line: ' """ ' }), session), true);

    eq(event.test(new Source({ line: '"' }), session), false);
    eq(event.test(new Source({ line: '""' }), session), false);
    eq(event.test(new Source({ line: '""" not a doc string' }), session), false);
    eq(event.test(new Source({ line: '""""' }), session), false);

    eq(event.test(new Source({ line: '---' }), session), false);
  });

  it('should interpret explicit --- docstrings', () => {
    const session = new Session().beginExplicitDocstring('---');
    const event = new ExplicitDocstringStopEvent();

    eq(event.interpret(new Source({ line: '---' }), session), undefined);
    deq(session.isProcessingDocstring(), false);
  });

  it('should interpret explicit """ docstrings', () => {
    const session = new Session({ docstring: { delimiter: '"""' } });
    const event = new ExplicitDocstringStopEvent();

    eq(event.interpret(new Source({ line: '"""' }), session), undefined);
    deq(session.isProcessingDocstring(), false);
  });
});
