import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:StepEvent');

export default class StepEvent extends BaseRegExpEvent {

  constructor(props = {}) {
    super({ description: 'a step', expected: props.expected, regexp: /^(.*)$/, debug });
  }

  interpret(source, session) {
    const [text] = this._match(source, session);
    session.setIndentation(source.indentation);
    return { text: text.trim() };
  }
}
