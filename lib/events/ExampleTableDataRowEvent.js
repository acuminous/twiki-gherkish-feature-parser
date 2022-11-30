import { UnexpectedNumberOfExamplesError } from '../Errors.js';
import BaseRegExpEvent from './BaseRegExpEvent.js';

export default class ExampleTableDataRowEvent extends BaseRegExpEvent {

  static description = 'an example table data row';

  constructor(props = {}) {
    super({ expected: props.expected, regexp: /^\s*\|((?: *[^ |][^|]* *\|?)+)\|\s*$/ });
  }

  interpret(source, session) {
    const examples = this._getExamples(source);
    if (session.numberOfExamples !== examples.length) throw new UnexpectedNumberOfExamplesError(source, session, examples.length);
    return { examples };
  }

  _getExamples(source) {
    const match = this._match(source);
    return match[1].split(/(?<!\\)\|/).map((value) => value.replace(/^ */, '').replace(/ *$/, ''));
  }
}
