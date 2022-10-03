import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

export default class AnnotationEvent extends BaseRegExpEvent {

  constructor(props = {}) {
    const { debug = Debug('twiki:gherkish-feature-parser:events:AnnotationEvent') } = props;
    super({ regexp: /^\s*@([^=]*)(?:=(.*))?$/, debug });
  }

  handle(source, session, state) {
    const match = this._match(source, session);
    if (!match) return false;

    this._debug(`Handling event: ${this.name} in state: ${state.name}`);
    const data = { name: match[1].trim(), value: match[2] ? match[2].trim() : true };
    state.onAnnotation({ name: this.name, source, data }, session);

    return true;
  }
}
