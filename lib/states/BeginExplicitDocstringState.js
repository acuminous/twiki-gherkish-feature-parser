import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const events = [
  new Events.EndEvent(),
  new Events.ExplicitDocstringStopEvent(),
  new Events.DocstringTextEvent({ expected: true }),
];

export default class BeginExplicitDocstringState extends BaseState {

  constructor({ machine, featureBuilder }) {
    super({ machine, featureBuilder, events });
  }

  onDocstringText(session, event, context) {
    this._machine.toCaptureExplicitDocstringState().dispatch(event, context);
  }
}
