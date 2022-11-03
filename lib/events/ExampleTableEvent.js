import Debug from 'debug';
import BaseKeywordEvent from './BaseKeywordEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:ExampleTableEvent');

export default class ExampleTableEvent extends BaseKeywordEvent {

  constructor(props = {}) {
    super({ description: 'an example table', expected: props.expected, keyword: 'examples', debug });
  }
}
