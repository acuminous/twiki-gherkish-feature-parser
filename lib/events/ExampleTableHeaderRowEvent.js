import BaseRegExpEvent from './BaseRegExpEvent.js';

export default class ExampleTableHeaderRowEvent extends BaseRegExpEvent {

  static description = 'an example table header row';

  constructor(props = {}) {
    super({ expected: props.expected, regexp: /^\s*\|((?:\s*\w+\s*\|?)+)\|\s*$/ });
  }

  interpret(source, session) {
    const headings = this.#getExampleTableHeadings(source);
    session.countExampleHeadings(headings);
    return { headings };
  }

  #getExampleTableHeadings(source) {
    const match = this._match(source);
    return match[1].split('|').map((heading) => heading.trim());
  }
}
