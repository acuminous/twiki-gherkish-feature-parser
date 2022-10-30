import Debug from 'debug';
import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const debug = Debug('twiki:gherkish-feature-parser:states:CreateScenarioStepImplicitDocStringState');

const events = [
  new Events.EndEvent({ expected: true }),
  new Events.ImplicitDocStringStartEvent(),
  new Events.ExplicitDocStringStartEvent(),
  new Events.ExplicitDocStringStopEvent(),
  new Events.ImplicitDocStringStopEvent({ expected: true }),
  new Events.DocStringTextEvent({ expected: true }),
];

export default class CreateScenarioStepImplicitDocStringState extends BaseState {

  constructor({ machine, featureBuilder }) {
    super({ machine, events, debug });
    this._featureBuilder = featureBuilder;
  }

  onDocStringText(session, event) {
    this._featureBuilder.createScenarioStepDocString({ ...event.data });
  }

  onImplicitDocStringStop(session, event) {
    this._machine.toAfterScenarioStepDocStringState();
    this._machine.interpret(event.source, session);
  }

  onEnd() {
    this._machine.toFinalState();
  }
}
