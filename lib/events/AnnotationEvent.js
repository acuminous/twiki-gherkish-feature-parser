import BaseRegExpEvent from './BaseRegExpEvent.js';

export default class AnnotationEvent extends BaseRegExpEvent {

  static description = 'an annotation';

  constructor(props = {}) {
    super({ expected: props.expected, regexp: /^\s*@([^=]*)(?:=(.*))?$/ });
  }

  interpret(source, session) {
    return this.#getData(source, session);
  }

  #getData(source) {
    const [, name, value] = this._match(source);
    return { name: name.trim(), value: value ? value.trim() : true };
  }
}
