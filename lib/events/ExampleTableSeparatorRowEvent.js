import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';
import { UnexpectedNumberOfExamples } from '../Errors.js';

const debug = Debug('twiki:gherkish-feature-parser:events:ExampleTableSeparatorRowEvent');

export default class ExampleTableSeparatorRowEvent extends BaseRegExpEvent {

  constructor(props = {}) {
    super({ description: 'an example table separator row', expected: props.expected, regexp: /^\s*((?:\|-+)+\|)\s*$/, debug });
  }

  interpret(source, session) {
    const examples = this._getExamples(source);
    if (session.numberOfExamples !== examples.length) throw new UnexpectedNumberOfExamples(source, session, examples);
  }

  _getExamples(source) {
    const [, separators] = this._match(source);
    return separators.split('|').slice(1, -1);
  }
}
