import BaseState from './BaseState.js';
import { AnnotationEvent, BlankLineEvent, EndEvent, FeatureEvent, BlockCommentEvent, SingleLineCommentEvent } from '../events/index.js';

const events = [EndEvent, BlockCommentEvent, SingleLineCommentEvent, AnnotationEvent, FeatureEvent, BlankLineEvent];

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

  onBlockComment() {
    this._machine.toConsumeBlockCommentState();
  }
}
