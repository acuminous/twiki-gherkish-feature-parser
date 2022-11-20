import Debug from 'debug';
import { UnexpectedNumberOfExamples } from '../Errors.js';
import BaseRegExpEvent from './BaseRegExpEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:ExampleTableDataRowEvent');

export default class ExampleTableDataRowEvent extends BaseRegExpEvent {

  static description = 'an example table data row';

  constructor(props = {}) {
    super({ expected: props.expected, regexp: /^\s*\|((?: *[^ |][^|]* *\|?)+)\|\s*$/, debug });
  }

  interpret(source, session) {
    const examples = this._getExamples(source);
    if (session.numberOfExamples !== examples.length) throw new UnexpectedNumberOfExamples(source, session, examples.length);
    return { examples };
  }

  _getExamples(source) {
    const match = this._match(source);
    return match[1].split('|').map((value) => value.replace(/^ */, '').replace(/ *$/, ''));
  }
}
