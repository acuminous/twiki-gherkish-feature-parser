import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:BlankLineEvent');

export default class BlankLineEvent extends BaseRegExpEvent {

  constructor(props = {}) {
    super({ description: 'a blank line', expected: props.expected, regexp: /^\s*$/, debug });
  }
}
