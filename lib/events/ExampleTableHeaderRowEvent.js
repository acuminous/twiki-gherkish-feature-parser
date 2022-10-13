import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:ExampleTableHeaderRowEvent');

export default class ExampleTableHeaderRowEvent extends BaseRegExpEvent {

  constructor(props = {}) {
    super({ description: 'an example table header row', expected: props.expected, regexp: /^\s*\|((?:\s*\w+\s*\|?)+)\|\s*$/, debug });
  }

  handle(source, session, state) {
    const match = this._match(source, session);
    if (!match) return false;

    const data = this._getData(match);
    this._updateSession(session, data);

    return this._dispatch(state, session, { source, data });
  }

  _getData(match) {
    return { headings: match[1].split('|').map((heading) => heading.trim()) };
  }

  _updateSession(session, data) {
    session.exampleTable = { columns: data.headings.length };
  }
}