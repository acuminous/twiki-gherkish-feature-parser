import BaseRegExpEvent from './BaseRegExpEvent.js';

export default class EndEvent extends BaseRegExpEvent {

  static description = 'the end of the feature';

  constructor(props = {}) {
    super({ expected: props.expected, regexp: /^\u0000$/ });
  }
}
