import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:ExampleTableDataRowEvent');

export default class ExampleTableDataRowEvent extends BaseRegExpEvent {

  constructor(props = {}) {
    super({ description: 'an example table data row', expected: props.expected, regexp: /^\s*\|((?: *[^ |][^|]* *\|?)+)\|\s*$/, debug });
  }

  interpret(source, session, state) {
    const match = this._match(source, session);
    if (!match) return false;

    return this.dispatch(state, session, { source, data: this._getData(match) });
  }

  _getData(match) {
    const values = match[1].split('|').map((value) => value.replace(/^ */, '').replace(/ *$/, ''));
    return { values };
  }
}
