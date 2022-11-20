import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:BlockCommentDelimiterEvent');

export default class BlockCommentDelimiterEvent extends BaseRegExpEvent {

  static description = 'a block comment delimiter';

  constructor(props = {}) {
    super({ expected: props.expected, regexp: /^\s*#{3}/, debug });
  }
}
