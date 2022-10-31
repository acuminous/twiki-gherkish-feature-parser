import Debug from 'debug';
import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const debug = Debug('twiki:gherkish-feature-parser:states:DeclareExplicitDocstringState');

const events = [
  new Events.EndEvent(),
  new Events.ExplicitDocStringStopEvent(),
  new Events.DocStringTextEvent({ expected: true }),
];

export default class DeclareExplicitDocstringState extends BaseState {

  constructor({ machine, featureBuilder }) {
    super({ machine, events, debug });
    this._featureBuilder = featureBuilder;
  }

  onDocStringText(session, event, context) {
    this._featureBuilder.createDocstring(context.data);
    this._machine.toCaptureExplicitDocstringState();
  }
}
