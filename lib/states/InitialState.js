import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const events = [
  Events.AnnotationEvent,
  Events.BlankLineEvent,
  Events.BlockCommentEvent,
  Events.EndEvent,
  Events.FeatureEvent,
  Events.SingleLineCommentEvent,
];

const validEvents = [
  Events.AnnotationEvent,
  Events.BlankLineEvent,
  Events.BlockCommentEvent,
  Events.FeatureEvent,
  Events.SingleLineCommentEvent,
];

export default class InitialState extends BaseState {

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

  onFeature(session, event) {
    this._featureBuilder.createFeature({ annotations: this._annotations, ...event.data });
    this._machine.toCreateFeatureState();
  }

  onSingleLineComment() {
    // Do nothing
  }
}
