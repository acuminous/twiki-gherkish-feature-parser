import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:AnnotationEvent');

export default class AnnotationEvent extends BaseRegExpEvent {

  constructor(props = {}) {
    super({ description: 'an annotation', expected: props.expected, regexp: /^\s*@([^=]*)(?:=(.*))?$/, debug });
  }

  interpret(source, session) {
    const match = this._match(source, session);
    return this._getData(match);
  }

  _getData(match) {
    return { name: match[1].trim(), value: match[2] ? match[2].trim() : true };
  }
}
