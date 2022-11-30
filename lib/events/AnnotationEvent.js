import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:AnnotationEvent');

export default class AnnotationEvent extends BaseRegExpEvent {

  static description = 'an annotation';

  constructor(props = {}) {
    super({ expected: props.expected, regexp: /^\s*@([^=]*)(?:=(.*))?$/, debug });
  }

  interpret(source, session) {
    return this.#getData(source, session);
  }

  #getData(source) {
    const [, name, value] = this._match(source);
    return { name: name.trim(), value: value ? value.trim() : true };
  }
}
