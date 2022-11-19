import Debug from 'debug';
import { UnexpectedNumberOfExamples } from '../Errors.js';
import BaseRegExpEvent from './BaseRegExpEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:ExampleTableDataRowEvent');

export default class ExampleTableDataRowEvent extends BaseRegExpEvent {

  constructor(props = {}) {
    super({ description: 'an example table data row', expected: props.expected, regexp: /^\s*\|((?: *[^ |][^|]* *\|?)+)\|\s*$/, debug });
  }

  interpret(source, session) {
    const values = this._getValues(source);
    if (session.numberOfExamples !== values.length) throw new UnexpectedNumberOfExamples(source, session, values);
    return { values };
  }

  _getValues(source) {
    const match = this._match(source);
    return match[1].split('|').map((value) => value.replace(/^ */, '').replace(/ *$/, ''));
  }
}
