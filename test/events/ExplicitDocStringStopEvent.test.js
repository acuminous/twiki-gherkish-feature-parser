import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Session } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { ExplicitDocstringStopEvent } = Events;

describe('ExplicitDocstringStopEvent', () => {

  it('should test explicit --- docstrings', () => {
    const session = new Session({ docstring: { delimiter: '---' } });
    const event = new ExplicitDocstringStopEvent();

    eq(event.test({ line: '---' }, session), true);
    eq(event.test({ line: ' --- ' }, session), true);

    eq(event.test({ line: '-' }, session), false);
    eq(event.test({ line: '--' }, session), false);
    eq(event.test({ line: '--- not a doc string' }, session), false);
    eq(event.test({ line: '----' }, session), false);

    eq(event.test({ line: '"""' }, session), false);
  });

  it('should test explicit """ docstrings', () => {
    const session = new Session({ docstring: { delimiter: '"""' } });
    const event = new ExplicitDocstringStopEvent();

    eq(event.test({ line: '"""' }, session), true);
    eq(event.test({ line: ' """ ' }, session), true);

    eq(event.test({ line: '"' }, session), false);
    eq(event.test({ line: '""' }, session), false);
    eq(event.test({ line: '""" not a doc string' }, session), false);
    eq(event.test({ line: '""""' }, session), false);

    eq(event.test({ line: '---' }, session), false);
  });

  it('should interpret explicit --- docstrings', () => {
    const session = new Session({ docstring: { delimiter: '---' } });
    const event = new ExplicitDocstringStopEvent();

    deq(event.interpret({ line: '---' }, session), {});
    deq(session.isProcessingDocstring(), false);
  });

  it('should interpret explicit """ docstrings', () => {
    const session = new Session({ docstring: { delimiter: '"""' } });
    const event = new ExplicitDocstringStopEvent();

    deq(event.interpret({ line: '"""' }, session), {});
    deq(session.isProcessingDocstring(), false);
  });
});
