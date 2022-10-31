import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Session } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { ExplicitDocStringStopEvent } = Events;

describe('ExplicitDocStringStopEvent', () => {

  it('should test explicit --- docstrings', () => {
    const session = new Session({ docstring: { token: '---' } });
    const event = new ExplicitDocStringStopEvent();

    eq(event.test({ line: '---' }, session), true);
    eq(event.test({ line: ' --- ' }, session), true);

    eq(event.test({ line: '-' }, session), false);
    eq(event.test({ line: '--' }, session), false);
    eq(event.test({ line: '--- not a doc string' }, session), false);
    eq(event.test({ line: '----' }, session), false);

    eq(event.test({ line: '"""' }, session), false);
  });

  it('should test explicit """ docstrings', () => {
    const session = new Session({ docstring: { token: '"""' } });
    const event = new ExplicitDocStringStopEvent();

    eq(event.test({ line: '"""' }, session), true);
    eq(event.test({ line: ' """ ' }, session), true);

    eq(event.test({ line: '"' }, session), false);
    eq(event.test({ line: '""' }, session), false);
    eq(event.test({ line: '""" not a doc string' }, session), false);
    eq(event.test({ line: '""""' }, session), false);

    eq(event.test({ line: '---' }, session), false);
  });

  it('should interpret explicit --- docstrings', () => {
    const session = new Session({ docstring: { token: '---' } });
    const event = new ExplicitDocStringStopEvent();

    deq(event.interpret({ line: '---' }, session), {});
    deq(session.isProcessingDocString(), false);
  });

  it('should interpret explicit """ docstrings', () => {
    const session = new Session({ docstring: { token: '"""' } });
    const event = new ExplicitDocStringStopEvent();

    deq(event.interpret({ line: '"""' }, session), {});
    deq(session.isProcessingDocString(), false);
  });
});
