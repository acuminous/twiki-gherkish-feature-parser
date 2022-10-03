import BaseState from './BaseState.js';
import { EndEvent, BlockCommentEvent, TextEvent } from '../events/index.js';

const events = [EndEvent, BlockCommentEvent, TextEvent];

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
