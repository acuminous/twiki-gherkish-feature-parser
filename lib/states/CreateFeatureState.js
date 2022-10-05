import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const events = [
  Events.AnnotationEvent,
  Events.BackgroundEvent,
  Events.BlankLineEvent,
  Events.BlockCommentEvent,
  Events.DocStringTokenStartEvent,
  Events.DocStringIndentStartEvent,
  Events.DocStringTokenStopEvent,
  Events.DocStringIndentStopEvent,
  Events.EndEvent,
  Events.FeatureEvent,
  Events.ScenarioEvent,
  Events.SingleLineCommentEvent,
  Events.TextEvent,
];

const validEvents = [
  Events.AnnotationEvent,
  Events.BackgroundEvent,
  Events.BlankLineEvent,
  Events.BlockCommentEvent,
  Events.ScenarioEvent,
  Events.SingleLineCommentEvent,
  Events.TextEvent,
];

export default class CreateFeatureState extends BaseState {

  constructor({ machine, featureBuilder }) {
    super({ machine, events, validEvents });
    this._featureBuilder = featureBuilder;
    this._annotations = [];
  }

  onAnnotation(session, event) {
    this._annotations.push({ ...event.data });
  }

  onBackground(session, event) {
    this._featureBuilder.createBackground({ annotations: this._annotations, ...event.data });
    this._machine.toCreateBackgroundState();
  }

  onBlankLine() {
    // Do nothing
  }

  onBlockComment() {
    this._machine.toConsumeBlockCommentState();
  }

  onScenario(session, event) {
    this._featureBuilder.createScenario({ annotations: this._annotations, ...event.data });
    this._machine.toCreateScenarioState();
  }

  onSingleLineComment() {
    // Do nothing
  }

  onText(session, event) {
    this._featureBuilder.describeFeature({ ...event.data });
  }
}
