import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const events = [
  Events.BlockCommentEvent,
  Events.EndEvent,
  Events.TextEvent,
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
