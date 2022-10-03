import BaseState from './BaseState.js';
import { AnnotationEvent, BlankLineEvent, EndEvent, FeatureEvent, MultiLineCommentEvent, SingleLineCommentEvent } from '../events/index.js';

const events = [EndEvent, MultiLineCommentEvent, SingleLineCommentEvent, AnnotationEvent, FeatureEvent, BlankLineEvent];

export default class InitialState extends BaseState {
  constructor({ machine, featureBuilder }) {
    super({ machine, events });
    this._featureBuilder = featureBuilder;
    this._annotations = [];
  }

  onAnnotation(event) {
    this._annotations.push({ ...event.data });
  }

  onFeature(event) {
    this._featureBuilder.createFeature({ annotations: this._annotations, ...event.data });
    this._machine.toCreateFeatureState();
  }

  onMultiLineComment() {
    this._machine.toConsumeMultiLineCommentState();
  }
}
