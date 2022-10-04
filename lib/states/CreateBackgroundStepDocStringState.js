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
  Events.DocStringIndentStopEvent,
  Events.DocStringTokenStopEvent,
];

export default class CreateBackgroundStepDocStringState extends BaseState {

  constructor({ machine, featureBuilder }) {
    super({ machine, events, validEvents });
    this._featureBuilder = featureBuilder;
  }

  getValidEvents(session) {
    const DocStringStopEvent = session.docString?.token ? Events.DocStringTokenStopEvent : Events.DocStringIndentStopEvent;
    return [Events.DocStringEvent, DocStringStopEvent];
  }

  onDocString(event) {
    this._featureBuilder.createBackgroundStepDocString({ ...event.data });
  }

  onDocStringIndentStop(event, session) {
    this._machine.toAfterBackgroundStepDocStringState();
    this._machine.handle(event.source, session);
  }

  onDocStringTokenStop() {
    this._machine.toAfterBackgroundStepDocStringState();
  }
}
