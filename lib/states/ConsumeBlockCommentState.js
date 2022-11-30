import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const events = [
  new Events.BlockCommentDelimiterEvent({ expected: true }),
  new Events.EndEvent(),
  new Events.TextEvent({ expected: true }),
];

export default class ConsumeBlockCommentState extends BaseState {

  constructor({ machine, featureBuilder }) {
    super({ machine, featureBuilder, events });
  }

  onBlockCommentDelimiter() {
    this._machine.unwind();
  }

  onText() {
    this._machine.noop();
  }
}
