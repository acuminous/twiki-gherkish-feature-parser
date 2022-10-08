import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const events = [
  new Events.BlockCommentEvent({ expected: true }),
  new Events.EndEvent(),
  new Events.TextEvent({ expected: true }),
];

export default class ConsumeBlockCommentState extends BaseState {

  constructor({ machine }) {
    super({ machine, events });
  }

  onBlockComment() {
    this._machine.toPreviousState();
  }

  onText() {
    // Do nothing
  }
}
