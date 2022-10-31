import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:ExampleTableHeaderRowEvent');

export default class ExampleTableHeaderRowEvent extends BaseRegExpEvent {

  constructor(props = {}) {
    super({ description: 'an example table header row', expected: props.expected, regexp: /^\s*\|((?:\s*\w+\s*\|?)+)\|\s*$/, debug });
  }

  interpret(source, session) {
    const match = this._match(source, session);
    const data = this._getData(match);
    this._updateSession(session, data);
    return data;
  }

  _getData(match) {
    return { headings: match[1].split('|').map((heading) => heading.trim()) };
  }

  _updateSession(session, data) {
    session.exampleTable = { columns: data.headings.length };
  }
}
