import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const events = [
  Events.DocStringTokenStartEvent,
  Events.DocStringIndentStartEvent,
  Events.DocStringTokenStopEvent,
  Events.DocStringIndentStopEvent,
  Events.DocStringTextEvent,
  Events.EndEvent,
];

const validEvents = [
  Events.DocStringTextEvent,
  Events.DocStringIndentStopEvent,
  Events.DocStringTokenStopEvent,
];

export default class CreateBackgroundStepDocStringState extends BaseState {

  constructor({ machine, featureBuilder }) {
    super({ machine, events, validEvents });
    this._featureBuilder = featureBuilder;
  }

  onDocStringText(session, event) {
    this._featureBuilder.createBackgroundStepDocString({ ...event.data });
  }

  onDocStringIndentStop(session, event) {
    this._machine.toAfterBackgroundStepDocStringState();
    this._machine.handle(event.source, session);
  }

  onDocStringTokenStop() {
    this._machine.toAfterBackgroundStepDocStringState();
  }
}
