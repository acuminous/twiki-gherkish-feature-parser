import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:AnnotationEvent');

export default class AnnotationEvent extends BaseRegExpEvent {

  constructor(props = {}) {
    super({ description: 'an annotation', expected: props.expected, regexp: /^\s*@([^=]*)(?:=(.*))?$/, debug });
  }

  interpret(source, session) {
    const [, name, value] = this._match(source, session);
    return this._getData(name, value);
  }

  _getData(name, value) {
    return { name: name.trim(), value: value ? value.trim() : true };
  }
}
