import Debug from 'debug';
import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const debug = Debug('twiki:gherkish-feature-parser:states:CaptureImplicitDocstringState');

const events = [
  new Events.ImplicitDocstringStopEvent({ expected: true }),
  new Events.DocstringTextEvent({ expected: true }),
];

export default class CaptureImplicitDocstringState extends BaseState {

  constructor({ machine, featureBuilder }) {
    super({ machine, events, debug });
    this._featureBuilder = featureBuilder;
  }

  onDocstringText(session, event, context) {
    this._featureBuilder.createDocstring(context.data);
  }

  onImplicitDocstringStop(session, event, context) {
    this._machine
      .unwind()
      .interpret(context.source);
  }
}
