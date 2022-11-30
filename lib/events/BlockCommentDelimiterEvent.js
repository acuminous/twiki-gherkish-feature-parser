import BaseRegExpEvent from './BaseRegExpEvent.js';

export default class BlockCommentDelimiterEvent extends BaseRegExpEvent {

  static description = 'a block comment delimiter';

  constructor(props = {}) {
    super({ expected: props.expected, regexp: /^\s*#{3}/ });
  }
}
