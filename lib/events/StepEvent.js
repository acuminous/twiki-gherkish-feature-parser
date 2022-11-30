import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:StepEvent');

export default class StepEvent extends BaseRegExpEvent {

  static description = 'a step';

  constructor(props = {}) {
    super({ expected: props.expected, regexp: /^(.*)$/, debug });
  }

  interpret(source, session) {
    session.indent(source.indentation);
    return this.#getData(source, session);
  }

  #getData(source, session) {
    const [text] = this._match(source, session);
    return { text: text.trim() };
  }
}
