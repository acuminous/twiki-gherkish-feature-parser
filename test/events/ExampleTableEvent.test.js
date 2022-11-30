import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Languages, Session, Source } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { ExampleTableEvent } = Events;

describe('ExampleTableEvent', () => {

  it('should test examples', () => {
    const session = new Session();
    const event = new ExampleTableEvent();

    eq(event.test(new Source({ line: 'Examples:' }), session), true);
    eq(event.test(new Source({ line: '  Examples  :  ' }), session), true);
    eq(event.test(new Source({ line: 'Examples  :' }), session), true);

    eq(event.test(new Source({ line: 'Examples' }), session), false);
  });

  it('should test localised examples', () => {
    const session = new Session({ language: Languages.Pirate });
    const event = new ExampleTableEvent();

    eq(event.test(new Source({ line: 'Wherest:' }), session), true);
    eq(event.test(new Source({ line: '  Wherest  :  ' }), session), true);
    eq(event.test(new Source({ line: 'Wherest  :' }), session), true);

    eq(event.test(new Source({ line: 'Wherest' }), session), false);
  });

  it('should interpret examples', () => {
    const session = new Session();
    const event = new ExampleTableEvent();

    eq(event.interpret(new Source({ line: 'Examples:' }), session), undefined);
    eq(event.interpret(new Source({ line: '  Examples  :  ' }), session), undefined);
    eq(event.interpret(new Source({ line: 'Examples  :' }), session), undefined);
  });

  it('should interpret localised examples', () => {
    const session = new Session({ language: Languages.Pirate });
    const event = new ExampleTableEvent();

    eq(event.interpret(new Source({ line: 'Wherest:' }), session), undefined);
    eq(event.interpret(new Source({ line: '  Wherest  :  ' }), session), undefined);
    eq(event.interpret(new Source({ line: 'Wherest  :' }), session), undefined);
  });
});
