import BaseKeywordEvent from './BaseKeywordEvent.js';

export default class ExampleTableEvent extends BaseKeywordEvent {

  static description = 'an example table';

  constructor(props = {}) {
    super({ expected: props.expected, keyword: 'examples' });
  }
}
