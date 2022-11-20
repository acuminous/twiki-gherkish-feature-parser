import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:SingleLineCommentEvent');

export default class SingleLineCommentEvent extends BaseRegExpEvent {

  static description = 'a single line comment';

  constructor(props = {}) {
    super({ expected: props.expected, regexp: /^\s*#/, debug });
  }
}
