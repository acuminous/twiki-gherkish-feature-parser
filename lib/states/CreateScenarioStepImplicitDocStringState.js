import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

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
    super({ machine, events });
    this._featureBuilder = featureBuilder;
  }

  onDocStringText(session, event) {
    this._featureBuilder.createScenarioStepDocString({ ...event.data });
  }

  onImplicitDocStringStop(session, event) {
    this._machine.toAfterScenarioStepDocStringState();
    this._machine.handle(event.source, session);
  }

  onEnd() {
    this._machine.toFinalState();
  }
}
