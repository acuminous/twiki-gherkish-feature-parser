import Debug from 'debug';
import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const debug = Debug('twiki:gherkish-feature-parser:states:InitialState');

const events = [
  new Events.AnnotationEvent({ expected: true }),
  new Events.BlankLineEvent({ expected: true }),
  new Events.BlockCommentEvent({ expected: true }),
  new Events.EndEvent(),
  new Events.BackgroundEvent(),
  new Events.ExampleTableEvent(),
  new Events.ExplicitDocStringStartEvent(),
  new Events.FeatureEvent({ expected: true }),
  new Events.SingleLineCommentEvent({ expected: true }),
  new Events.ScenarioEvent(),
  new Events.TextEvent(),
];

export default class InitialState extends BaseState {

  constructor({ machine, featureBuilder }) {
    super({ machine, events, debug });
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
    this._machine.toBlockCommentState();
  }

  onFeature(session, event) {
    this._featureBuilder.createFeature({ annotations: this._annotations, ...event.data });
    this._machine.toDeclareFeatureState();
  }

  onSingleLineComment() {
    // Do nothing
  }
}