import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { AnnotationEvent } = Events;

describe('AnnotationEvent', () => {

  it('should test annotations', () => {
    const event = new AnnotationEvent();
    eq(event.test({ line: '@foo' }), true);
    eq(event.test({ line: '@foo=bar ' }), true);
    eq(event.test({ line: ' @foo ' }), true);
    eq(event.test({ line: ' @foo = bar ' }), true);

    eq(event.test({ line: 'foo' }), false);
    eq(event.test({ line: 'name=value' }), false);
    eq(event.test({ line: 'email@example.com' }), false);
  });

  it('should interpret annotations', () => {
    const event = new AnnotationEvent();
    deq(event.interpret({ line: '@foo' }), { name: 'foo', value: true });
    deq(event.interpret({ line: '@foo=bar ' }), { name: 'foo', value: 'bar' });
    deq(event.interpret({ line: ' @foo ' }), { name: 'foo', value: true });
    deq(event.interpret({ line: ' @foo = bar ' }), { name: 'foo', value: 'bar' });
  });
});
