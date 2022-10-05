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
  Events.SingleLineCommentEvent,
  Events.ScenarioEvent,
  Events.StepEvent,
];

const validEvents = [
  Events.AnnotationEvent,
  Events.BlankLineEvent,
  Events.BlockCommentEvent,
  Events.SingleLineCommentEvent,
  Events.StepEvent,
];

export default class CreateBackgroundState extends BaseState {

  constructor({ machine, featureBuilder }) {
    super({ machine, events, validEvents });
    this._featureBuilder = featureBuilder;
    this._annotations = [];
  }

  onAnnotation(session, event) {
    this._annotations.push({ ...event.data });
  }

  onBlankLine() {
    // Do nothing
  }

  onBlockComment() {
    this._machine.toConsumeBlockCommentState();
  }

  onSingleLineComment() {
    // Do nothing
  }

  onStep(session, event) {
    this._featureBuilder.createBackgroundStep({ annotations: this._annotations, ...event.data });
    this._machine.toAfterBackgroundStepState();
  }
}
