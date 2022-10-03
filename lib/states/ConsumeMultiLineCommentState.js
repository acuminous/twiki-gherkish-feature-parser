import BaseState from './BaseState.js';
import { EndEvent, MultiLineCommentEvent, TextEvent } from '../events/index.js';

const events = [EndEvent, MultiLineCommentEvent, TextEvent];

export default class ConsumeMultiLineCommentState extends BaseState {
  constructor({ machine }) {
    super({ machine, events });
  }

  onMultiLineComment() {
    this._machine.toPreviousState();
  }

  onText() {
    // Do nothing
  }
}
