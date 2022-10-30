import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Languages } from '../../lib/index.js';
import StubState from '../stubs/StubState.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { AnnotationEvent } = Events;

describe('AnnotationEvent', () => {
  let session;

  beforeEach(() => {
    session = { language: Languages.English };
  });

  it('should recognise annotations', () => {
    const state = new StubState();
    const event = new AnnotationEvent();

    eq(event.interpret({ line: '@skip' }, session, state), true);
    eq(event.interpret({ line: '@name=value ' }, session, state), true);
    eq(event.interpret({ line: ' @skip ' }, session, state), true);
    eq(event.interpret({ line: ' @name = value ' }, session, state), true);

    eq(event.interpret({ line: 'skip' }, session, state), false);
    eq(event.interpret({ line: 'name=value' }, session, state), false);
    eq(event.interpret({ line: 'email@example.com' }, session, state), false);
  });

  it('should handle simple annotations', () => {
    const state = new StubState((event, context) => {
      eq(event.name, 'AnnotationEvent');
      eq(context.source.line, '@skip');
      eq(context.source.number, 1);
      eq(context.data.name, 'skip');
      eq(context.data.value, true);
    });
    const event = new AnnotationEvent();

    event.interpret({ line: '@skip', number: 1 }, session, state);

    eq(state.count, 1);
  });

  it('should handle name/value annotations', () => {
    const state = new StubState((event, context) => {
      eq(event.name, 'AnnotationEvent');
      eq(context.source.line, '@foo=bar');
      eq(context.source.number, 1);
      eq(context.data.name, 'foo');
      eq(context.data.value, 'bar');
    });
    const event = new AnnotationEvent();

    event.interpret({ line: '@foo=bar', number: 1 }, session, state);

    eq(state.count, 1);
  });
});
