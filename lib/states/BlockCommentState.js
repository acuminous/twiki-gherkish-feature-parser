import Debug from 'debug';
import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const debug = Debug('twiki:gherkish-feature-parser:states:BlockCommentState');

const events = [
  new Events.BlockCommentEvent({ expected: true }),
  new Events.EndEvent(),
  new Events.TextEvent({ expected: true }),
];

export default class BlockCommentState extends BaseState {

  constructor({ machine }) {
    super({ machine, events, debug });
  }

  onBlockComment() {
    this._machine.toPreviousState();
  }

  onText() {
    // Do nothing
  }
}