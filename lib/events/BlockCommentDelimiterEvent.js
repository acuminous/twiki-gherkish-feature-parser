import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:BlockCommentDelimiterEvent');

export default class BlockCommentDelimiterEvent extends BaseRegExpEvent {

  constructor(props = {}) {
    super({ description: 'a block comment delimiter', expected: props.expected, regexp: /^\s*#{3}/, debug });
  }
}
