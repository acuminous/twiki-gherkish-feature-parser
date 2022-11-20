import Debug from 'debug';
import BaseKeywordEvent from './BaseKeywordEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:ExampleTableEvent');

export default class ExampleTableEvent extends BaseKeywordEvent {

  static description = 'an example table';

  constructor(props = {}) {
    super({ expected: props.expected, keyword: 'examples', debug });
  }
}
