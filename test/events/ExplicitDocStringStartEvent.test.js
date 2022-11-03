import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Session } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { ExplicitDocstringStartEvent } = Events;

describe('ExplicitDocstringStartEvent', () => {

  it('should test explicit docstrings', () => {
    const session = new Session();
    const event = new ExplicitDocstringStartEvent();
    eq(event.test({ line: '---' }, session), true);
    eq(event.test({ line: ' --- ' }, session), true);
    eq(event.test({ line: ' ------ ' }, session), true);
    eq(event.test({ line: '"""' }, session), true);
    eq(event.test({ line: ' """ ' }, session), true);
    eq(event.test({ line: ' """""" ' }, session), true);

    eq(event.test({ line: '-' }, session), false);
    eq(event.test({ line: '--' }, session), false);
    eq(event.test({ line: '--- not a doc string' }, session), false);
    eq(event.test({ line: '"' }, session), false);
    eq(event.test({ line: '""' }, session), false);
    eq(event.test({ line: '""" not a doc string' }, session), false);
  });

  it('should not recognise token docstrings when already handling an implicit docstring', () => {
    const session = new Session({ docstring: {} });
    const event = new ExplicitDocstringStartEvent();

    eq(event.test({ line: '---' }, session), false);
    eq(event.test({ line: '"""' }, session), false);
  });

  it('should not recognise token docstrings when already handling a matching explicit docstring', () => {
    const session = new Session({ docstring: { token: '---' } });
    const event = new ExplicitDocstringStartEvent();

    eq(event.test({ line: '---' }, session), false);
  });

  it('should not recognise token docstrings when already handling an alternative explicit docstring', () => {
    const session = new Session({ docstring: { token: '---' } });
    const event = new ExplicitDocstringStartEvent();

    eq(event.test({ line: '"""' }, session), false);
  });

  it('should interpret explicit docstrings', () => {
    const session = new Session();
    const event = new ExplicitDocstringStartEvent();

    deq(event.interpret({ line: '---' }, session), {});
    deq(event.interpret({ line: ' --- ' }, session), {});
    deq(event.interpret({ line: ' ------ ' }, session), {});
    deq(event.interpret({ line: '"""' }, session), {});
    deq(event.interpret({ line: ' """ ' }, session), {});
    deq(event.interpret({ line: ' """""" ' }, session), {});
  });
});
