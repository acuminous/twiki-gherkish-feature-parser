import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:ExampleTableSeparatorRowEvent');

export default class ExampleTableSeparatorRowEvent extends BaseRegExpEvent {

  constructor(props = {}) {
    super({ description: 'an example table separator row', expected: props.expected, regexp: /^\s*(?:\|-+)+\|\s*$/, debug });
  }

  interpret() {
    return {};
  }
}
