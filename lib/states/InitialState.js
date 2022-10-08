import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const events = [
  new Events.AnnotationEvent({ expected: true }),
  new Events.BlankLineEvent({ expected: true }),
  new Events.BlockCommentEvent({ expected: true }),
  new Events.EndEvent(),
  new Events.FeatureEvent({ expected: true }),
  new Events.SingleLineCommentEvent({ expected: true }),
];

export default class InitialState extends BaseState {

  constructor({ machine, featureBuilder }) {
    super({ machine, events });
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
