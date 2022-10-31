import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:SingleLineCommentEvent');

export default class SingleLineCommentEvent extends BaseRegExpEvent {

  constructor(props = {}) {
    super({ description: 'a single line comment', expected: props.expected, regexp: /^\s*#/, debug });
  }

  interpret() {
    return {};
  }
}
