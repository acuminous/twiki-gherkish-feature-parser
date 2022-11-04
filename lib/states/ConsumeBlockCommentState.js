import Debug from 'debug';
import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const debug = Debug('twiki:gherkish-feature-parser:states:ConsumeBlockCommentState');

const events = [
  new Events.BlockCommentDelimiterEvent({ expected: true }),
  new Events.EndEvent(),
  new Events.TextEvent({ expected: true }),
];

export default class ConsumeBlockCommentState extends BaseState {

  constructor({ machine }) {
    super({ machine, events, debug });
  }

  onBlockCommentDelimiter() {
    this._machine.unwind();
  }

  onText() {
    this._machine.noop();
  }
}
