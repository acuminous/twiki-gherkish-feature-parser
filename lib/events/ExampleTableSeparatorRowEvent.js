import Debug from 'debug';
import BaseEvent from './BaseEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:ExampleTableSeparatorRowEvent');

export default class ExampleTableSeparatorRowEvent extends BaseEvent {

  constructor(props = {}) {
    super({ description: 'an example table separator row', expected: props.expected, debug });
  }

  test(source, session) {
    const n = session.numberOfExampleHeadings;
    const regexp = new RegExp(`^\\s*(?:\\|-+){${n}}\\|\\s*$`);
    const result = regexp.test(source.line);
    this._debug(`Testing "${source.line}" using ${regexp}: ${result}`);
    return result;
  }
}
