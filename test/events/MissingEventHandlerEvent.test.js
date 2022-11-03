import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { MissingEventHandlerEvent } = Events;

describe('MissingEventHandlerEvent', () => {

  it('should recognise anything', () => {
    const event = new MissingEventHandlerEvent();
    eq(event.test({ line: 'anything' }), true);
  });

  it('should interpret anything', () => {
    const event = new MissingEventHandlerEvent();
    eq(event.interpret({ line: 'anything' }), undefined);
  });
});
