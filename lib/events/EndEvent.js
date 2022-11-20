import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:EndEvent');

export default class EndEvent extends BaseRegExpEvent {

  static description = 'the end of the feature';

  constructor(props = {}) {
    super({ expected: props.expected, regexp: /^\u0000$/, debug });
  }
}
