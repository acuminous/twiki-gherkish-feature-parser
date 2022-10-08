import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import FeatureEvent from '../../lib/events/FeatureEvent.js';
import { States } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { BaseState } = States;

describe('Missing event handler', () => {
  it('should report states with missing event handlers', () => {
    throws(() => new InvalidState(), { message: 'InvalidState is missing an onFeature event handler' });
  });
});

class InvalidState extends BaseState {
  constructor() {
    super({ events: [new FeatureEvent({ expected: true })] });
  }
}