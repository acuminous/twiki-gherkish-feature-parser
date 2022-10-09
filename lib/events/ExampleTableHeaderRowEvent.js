import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:ExampleTableHeaderRowEvent');

export default class ExampleTableHeaderRowEvent extends BaseRegExpEvent {

  constructor(props = {}) {
    super({ description: 'an example table header row', expected: props.expected, regexp: /^\s*(?:\|\s*\w+\s*)+\|\s*$/, debug });
  }

  handle(source, session, state) {
    const match = this._match(source, session);
    if (!match) return false;

    return this._dispatch(state, session, { source, data: this._getData(match) });
  }

  _getData(match) {
    const headings = match[0].split('|').filter(Boolean).map((heading) => heading.trim());
    return { headings };
  }
}
