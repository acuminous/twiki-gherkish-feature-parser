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

    eq(event.handle({ line: '@skip' }, session, state), true);
    eq(event.handle({ line: '@name=value ' }, session, state), true);
    eq(event.handle({ line: ' @skip ' }, session, state), true);
    eq(event.handle({ line: ' @name = value ' }, session, state), true);

    eq(event.handle({ line: 'skip' }, session, state), false);
    eq(event.handle({ line: 'name=value' }, session, state), false);
    eq(event.handle({ line: 'email@example.com' }, session, state), false);
  });

  it('should handle simple annotations', () => {
    const state = new StubState((event) => {
      eq(event.name, 'AnnotationEvent');
      eq(event.source.line, '@skip');
      eq(event.source.number, 1);
      eq(event.data.name, 'skip');
      eq(event.data.value, true);
    });
    const event = new AnnotationEvent();

    event.handle({ line: '@skip', number: 1 }, session, state);

    eq(state.count, 1);
  });

  it('should handle name/value annotations', () => {
    const state = new StubState((event) => {
      eq(event.name, 'AnnotationEvent');
      eq(event.source.line, '@foo=bar');
      eq(event.source.number, 1);
      eq(event.data.name, 'foo');
      eq(event.data.value, 'bar');
    });
    const event = new AnnotationEvent();

    event.handle({ line: '@foo=bar', number: 1 }, session, state);

    eq(state.count, 1);
  });
});
