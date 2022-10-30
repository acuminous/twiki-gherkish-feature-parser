import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Languages } from '../../lib/index.js';
import StubState from '../stubs/StubState.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { TextEvent } = Events;

describe('TextEvent', () => {

  it('should recognise text', () => {
    const session = { language: Languages.English };
    const state = new StubState();
    const event = new TextEvent();

    eq(event.interpret({ line: 'some text' }, session, state), true);
    eq(event.interpret({ line: ' some text ' }, session, state), true);
  });

  it('should recognise localised text', () => {
    const session = { language: Languages.English };
    const state = new StubState();
    const event = new TextEvent();

    eq(event.interpret({ line: 'Given some text' }, session, state), true);
    eq(event.interpret({ line: 'When some text' }, session, state), true);
    eq(event.interpret({ line: 'Then some text' }, session, state), true);
    eq(event.interpret({ line: 'And some text' }, session, state), true);
    eq(event.interpret({ line: '  Given some text  ' }, session, state), true);
    eq(event.interpret({ line: 'some text' }, session, state), true);
  });

  it('should handle text', () => {
    const session = { language: Languages.English };
    const state = new StubState((event, context) => {
      eq(event.name, 'TextEvent');
      eq(context.source.line, '  some text  ');
      eq(context.source.number, 1);
      eq(context.data.text, '  some text  ');
    });
    const event = new TextEvent();

    event.interpret({ line: '  some text  ', number: 1 }, { ...session, indentation: 0 }, state);

    eq(state.count, 1);
  });
});
