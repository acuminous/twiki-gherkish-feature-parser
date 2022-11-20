import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:BlankLineEvent');

export default class BlankLineEvent extends BaseRegExpEvent {

  static description = 'a blank line';

  constructor(props = {}) {
    super({ expected: props.expected, regexp: /^\s*$/, debug });
  }
}
