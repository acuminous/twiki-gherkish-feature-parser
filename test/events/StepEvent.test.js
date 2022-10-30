import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Languages } from '../../lib/index.js';
import StubState from '../stubs/StubState.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { StepEvent } = Events;

describe('StepEvent', () => {

  it('should recognise steps', () => {
    const session = { language: Languages.English };
    const state = new StubState();
    const event = new StepEvent();

    eq(event.interpret({ line: 'Some step' }, session, state), true);
    eq(event.interpret({ line: ' Some step ' }, session, state), true);
  });

  it('should recognise localised steps', () => {
    const session = { language: Languages.English };
    const state = new StubState();
    const event = new StepEvent();

    eq(event.interpret({ line: 'Given some step' }, session, state), true);
    eq(event.interpret({ line: 'When some step' }, session, state), true);
    eq(event.interpret({ line: 'Then some step' }, session, state), true);
    eq(event.interpret({ line: 'And some step' }, session, state), true);
    eq(event.interpret({ line: '  Given some step  ' }, session, state), true);
  });

  it('should recognise unlocalised steps', () => {
    const session = { language: Languages.English };
    const state = new StubState();
    const event = new StepEvent();

    eq(event.interpret({ line: 'some text' }, session, state), true);
    eq(event.interpret({ line: ' some text ' }, session, state), true);
  });

  it('should handle localised steps', () => {
    const session = { language: Languages.English };
    const state = new StubState((event) => {
      eq(event.name, 'StepEvent');
      eq(event.source.line, ' Given some step  ');
      eq(event.source.number, 1);
      eq(event.data.text, 'Given some step');
    });
    const event = new StepEvent();

    event.interpret({ line: ' Given some step  ', number: 1 }, session, state);

    eq(state.count, 1);
  });

  it('should handle unlocalised steps', () => {
    const session = { language: Languages.English };
    const state = new StubState((event) => {
      eq(event.name, 'StepEvent');
      eq(event.source.line, '  Some step  ');
      eq(event.source.number, 1);
      eq(event.data.text, 'Some step');
    });

    const event = new StepEvent();
    event.interpret({ line: '  Some step  ', number: 1 }, session, state);

    eq(state.count, 1);
  });
});
