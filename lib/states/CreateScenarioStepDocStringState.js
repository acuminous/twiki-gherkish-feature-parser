import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const events = [
  new Events.DocStringIndentStartEvent(),
  new Events.DocStringTokenStartEvent(),
  new Events.DocStringIndentStopEvent({ expected: true }),
  new Events.DocStringTokenStopEvent({ expected: true }),
  new Events.DocStringTextEvent({ expected: true }),
  new Events.EndEvent(),
];

export default class CreateScenarioStepDocStringState extends BaseState {

  constructor({ machine, featureBuilder }) {
    super({ machine, events });
    this._featureBuilder = featureBuilder;
  }

  onDocStringText(session, event) {
    this._featureBuilder.createScenarioStepDocString({ ...event.data });
  }

  onDocStringIndentStop(session, event) {
    this._machine.toAfterScenarioStepDocStringState();
    this._machine.handle(event.source, session);
  }

  onDocStringTokenStop() {
    this._machine.toAfterScenarioStepDocStringState();
  }
}
