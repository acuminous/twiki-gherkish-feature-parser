import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:ExampleTableHeaderRowEvent');

export default class ExampleTableHeaderRowEvent extends BaseRegExpEvent {

  constructor(props = {}) {
    super({ description: 'an example table header row', expected: props.expected, regexp: /^\s*\|((?:\s*\w+\s*\|?)+)\|\s*$/, debug });
  }

  interpret(source, session) {
    const headings = this._getExampleTableHeadings(source);
    session.countExampleHeadings(headings);
    return { headings };
  }

  _getExampleTableHeadings(source) {
    const match = this._match(source);
    return match[1].split('|').map((heading) => heading.trim());
  }
}
