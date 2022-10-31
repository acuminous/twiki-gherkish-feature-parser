import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:StepEvent');

export default class StepEvent extends BaseRegExpEvent {

  constructor(props = {}) {
    super({ description: 'a step', expected: props.expected, regexp: /^(.*)$/, debug });
  }

  interpret(source, session) {
    const match = this._match(source, session);
    this._updateSession(source, session);
    return this._getData(match);
  }

  _updateSession(source, session) {
    session.indentation = source.indentation;
  }

  _getData(match) {
    return { text: match[0].trim() };
  }
}
