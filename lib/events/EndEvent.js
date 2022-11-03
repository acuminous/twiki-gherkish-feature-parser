import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:EndEvent');

export default class EndEvent extends BaseRegExpEvent {

  constructor(props = {}) {
    super({ description: 'the end of the feature', expected: props.expected, regexp: /^\u0000$/, debug });
  }
}
