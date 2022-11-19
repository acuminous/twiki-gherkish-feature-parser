import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:StepEvent');

export default class StepEvent extends BaseRegExpEvent {

  constructor(props = {}) {
    super({ description: 'a step', expected: props.expected, regexp: /^(.*)$/, debug });
  }

  interpret(source, session) {
    session.indent(source.indentation);
    return this._getData(source, session);
  }

  _getData(source, session) {
    const [text] = this._match(source, session);
    return { text: text.trim() };
  }
}
