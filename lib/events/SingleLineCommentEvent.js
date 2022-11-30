import BaseRegExpEvent from './BaseRegExpEvent.js';

export default class SingleLineCommentEvent extends BaseRegExpEvent {

  static description = 'a single line comment';

  constructor(props = {}) {
    super({ expected: props.expected, regexp: /^\s*#/ });
  }
}
