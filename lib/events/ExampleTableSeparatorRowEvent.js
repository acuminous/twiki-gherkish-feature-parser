import BaseRegExpEvent from './BaseRegExpEvent.js';
import { UnexpectedNumberOfColumnsError } from '../Errors.js';

export default class ExampleTableSeparatorRowEvent extends BaseRegExpEvent {

  static description = 'an example table separator row';

  constructor(props = {}) {
    super({ description: 'an example table separator row', expected: props.expected, regexp: /^\s*((?:\|-+)+\|)\s*$/ });
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
