import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Session, Source } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { StepEvent } = Events;

describe('StepEvent', () => {

  it('should test steps', () => {
    const event = new StepEvent();

    eq(event.test(new Source({ line: 'Some step' })), true);
    eq(event.test(new Source({ line: ' Some step ' })), true);
  });

  it('should interpret steps', () => {
    const session = new Session();
    const event = new StepEvent();

    deq(event.interpret(new Source({ line: 'Some step' }), session), { text: 'Some step' });
    deq(event.interpret(new Source({ line: ' Some step ' }), session), { text: 'Some step' });
  });
});
