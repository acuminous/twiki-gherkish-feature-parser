import Debug from 'debug';
import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const debug = Debug('twiki:gherkish-feature-parser:states:BeginExplicitDocstringState');

const events = [
  new Events.EndEvent(),
  new Events.ExplicitDocstringStopEvent(),
  new Events.DocstringTextEvent({ expected: true }),
];

export default class BeginExplicitDocstringState extends BaseState {

  constructor({ machine, featureBuilder }) {
    super({ machine, events, debug });
    this._featureBuilder = featureBuilder;
  }

  onDocstringText(session, event, context) {
    this._machine
      .toCaptureExplicitDocstringState()
      .dispatch(event, context);
  }
}
