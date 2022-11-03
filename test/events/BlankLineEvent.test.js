import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { BlankLineEvent } = Events;

describe('BlankLineEvent', () => {

  it('should test blank lines', () => {
    const event = new BlankLineEvent();

    eq(event.test({ line: '' }), true);
    eq(event.test({ line: '   ' }), true);

    eq(event.test({ line: 'Not Blank' }), false);
  });

  it('should interpret blank lines', () => {
    const event = new BlankLineEvent();

    eq(event.interpret({ line: '' }), undefined);
    eq(event.interpret({ line: '   ' }), undefined);
  });
});
