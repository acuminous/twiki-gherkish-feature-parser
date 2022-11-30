import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const events = [
  new Events.EndEvent(),
  new Events.ExplicitDocstringStopEvent({ expected: true }),
  new Events.DocstringTextEvent({ expected: true }),
];

export default class CaptureExplicitDocstringState extends BaseState {

  constructor({ machine, featureBuilder }) {
    super({ machine, featureBuilder, events });
  }

  onDocstringText(session, event, context) {
    this._featureBuilder.createDocstring(context.data);
  }

  onExplicitDocstringStop() {
    this._machine.toEndDocstringState();
  }
}
