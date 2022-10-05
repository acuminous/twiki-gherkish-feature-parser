import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const events = [
  Events.DocStringTokenStartEvent,
  Events.DocStringIndentStartEvent,
  Events.DocStringTokenStopEvent,
  Events.DocStringIndentStopEvent,
  Events.DocStringEvent,
  Events.EndEvent,
];

const validEvents = [
  Events.DocStringEvent,
  Events.DocStringTokenStopEvent,
  Events.DocStringIndentStopEvent,
];

export default class CreateScenarioStepDocStringState extends BaseState {

  constructor({ machine, featureBuilder }) {
    super({ machine, events, validEvents });
    this._featureBuilder = featureBuilder;
  }

  onDocString(session, event) {
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
