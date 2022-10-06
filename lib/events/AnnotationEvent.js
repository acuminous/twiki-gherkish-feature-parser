import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:AnnotationEvent');

export default class AnnotationEvent extends BaseRegExpEvent {

  constructor() {
    super({ description: 'an annotation', handlerName: 'onAnnotation', regexp: /^\s*@([^=]*)(?:=(.*))?$/, debug });
  }

  handle(source, session, state) {
    const match = this._match(source, session);
    if (!match) return false;

    return this._dispatch(state, session, { source, data: this._getData(match) });
  }

  _getData(match) {
    return { name: match[1].trim(), value: match[2] ? match[2].trim() : true };
  }
}
