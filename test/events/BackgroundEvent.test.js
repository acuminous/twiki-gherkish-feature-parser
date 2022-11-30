import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Languages, Session, Source } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { BackgroundEvent } = Events;

describe('BackgroundEvent', () => {

  it('should test backgrounds', () => {
    const session = new Session();
    const event = new BackgroundEvent();

    eq(event.test(new Source({ line: 'background: Some background' }), session), true);
    eq(event.test(new Source({ line: 'Background: Some background' }), session), true);
    eq(event.test(new Source({ line: '  Background  : Some background  ' }), session), true);
    eq(event.test(new Source({ line: 'Background  :' }), session), true);

    eq(event.test(new Source({ line: 'Background' }), session), false);
  });

  it('should test localised backgrounds', () => {
    const session = new Session({ language: Languages.Pirate });
    const event = new BackgroundEvent();

    eq(event.test(new Source({ line: 'Lore: Some background' }), session), true);
    eq(event.test(new Source({ line: 'Lore: Some background' }), session), true);
    eq(event.test(new Source({ line: '  Lore  : Some background  ' }), session), true);
    eq(event.test(new Source({ line: 'Lore  :' }), session), true);

    eq(event.test(new Source({ line: 'Lore' }), session), false);
  });

  it('should interpret backgrounds', () => {
    const session = new Session();
    const event = new BackgroundEvent();

    deq(event.interpret(new Source({ line: 'background: Some background' }), session), { title: 'Some background' });
    deq(event.interpret(new Source({ line: 'Background: Some background' }), session), { title: 'Some background' });
    deq(event.interpret(new Source({ line: '  Background  : Some background  ' }), session), { title: 'Some background' });
    deq(event.interpret(new Source({ line: 'Background  :' }), session), { title: '' });
  });

  it('should interpret localised backgrounds', () => {
    const session = new Session({ language: Languages.Pirate });
    const event = new BackgroundEvent();

    deq(event.interpret(new Source({ line: 'Lore: Some background' }), session), { title: 'Some background' });
    deq(event.interpret(new Source({ line: 'Lore: Some background' }), session), { title: 'Some background' });
    deq(event.interpret(new Source({ line: '  Lore  : Some background  ' }), session), { title: 'Some background' });
    deq(event.interpret(new Source({ line: 'Lore  :' }), session), { title: '' });
  });
});
