import BaseRegExpEvent from './BaseRegExpEvent.js';

export default class BlankLineEvent extends BaseRegExpEvent {

  static description = 'a blank line';

  constructor(props = {}) {
    super({ expected: props.expected, regexp: /^\s*$/ });
  }
}
