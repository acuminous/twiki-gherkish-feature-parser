import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';
import { UnexpectedNumberOfColumnsError } from '../Errors.js';

const debug = Debug('twiki:gherkish-feature-parser:events:ExampleTableSeparatorRowEvent');

export default class ExampleTableSeparatorRowEvent extends BaseRegExpEvent {

  static description = 'an example table separator row';

  constructor(props = {}) {
    super({ description: 'an example table separator row', expected: props.expected, regexp: /^\s*((?:\|-+)+\|)\s*$/, debug });
  }

  interpret(source, session) {
    const numberOfColumns = this.#getNumberOfColumns(source);
    if (session.numberOfExamples !== numberOfColumns) throw new UnexpectedNumberOfColumnsError(source, session, numberOfColumns);
  }

  #getNumberOfColumns(source) {
    const [, separators] = this._match(source);
    return separators.split('|').slice(1, -1).length;
  }
}
