import Debug from 'debug';
import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const debug = Debug('twiki:gherkish-feature-parser:states:CreateBackgroundStepImplicitDocStringState');

const events = [
  new Events.EndEvent({ expected: true }),
  new Events.ExplicitDocStringStartEvent(),
  new Events.ImplicitDocStringStartEvent(),
  new Events.ExplicitDocStringStopEvent(),
  new Events.ImplicitDocStringStopEvent({ expected: true }),
  new Events.DocStringTextEvent({ expected: true }),
];

export default class CreateBackgroundStepImplicitDocStringState extends BaseState {

  constructor({ machine, featureBuilder }) {
    super({ machine, events, debug });
    this._featureBuilder = featureBuilder;
  }

  onDocStringText(session, event, context) {
    this._featureBuilder.createBackgroundStepDocString({ ...context.data });
  }

  onImplicitDocStringStop(session, event, context) {
    this._machine.toAfterBackgroundStepDocStringState();
    this._machine.interpret(context.source, session);
  }

  onEnd() {
    this._machine.toFinalState();
  }
}
