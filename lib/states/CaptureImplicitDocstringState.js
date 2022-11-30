import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const events = [
  new Events.ImplicitDocstringStopEvent({ expected: true }),
  new Events.DocstringTextEvent({ expected: true }),
];

export default class CaptureImplicitDocstringState extends BaseState {

  constructor({ machine, featureBuilder }) {
    super({ machine, featureBuilder, events });
  }

  onDocstringText(session, event, context) {
    this._featureBuilder.createDocstring(context.data);
  }

  onImplicitDocstringStop(session, event, context) {
    this._machine.toEndDocstringState().interpret(context.source);
  }
}
