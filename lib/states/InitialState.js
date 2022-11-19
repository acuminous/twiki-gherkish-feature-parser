import Debug from 'debug';
import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const debug = Debug('twiki:gherkish-feature-parser:states:InitialState');

const events = [
  new Events.AnnotationEvent({ expected: true }),
  new Events.BlankLineEvent({ expected: true }),
  new Events.BlockCommentDelimiterEvent({ expected: true }),
  new Events.EndEvent(),
  new Events.BackgroundEvent(),
  new Events.ExampleTableEvent(),
  new Events.ExplicitDocstringStartEvent(),
  new Events.FeatureEvent({ expected: true }),
  new Events.RuleEvent(),
  new Events.SingleLineCommentEvent({ expected: true }),
  new Events.ScenarioEvent(),
  new Events.TextEvent(),
];

export default class InitialState extends BaseState {

  constructor({ machine, featureBuilder }) {
    super({ machine, events, debug });
    this._featureBuilder = featureBuilder;
  }

  onAnnotation(session, event, context) {
    this._machine.checkpoint().toCaptureAnnotationState().dispatch(event, context);
  }

  onBlankLine() {
    this._machine.noop();
  }

  onBlockCommentDelimiter() {
    this._machine.checkpoint().toConsumeBlockCommentState();
  }

  onFeature(session, event, context) {
    this._featureBuilder.createFeature(context.data);
    this._machine.toDeclareFeatureState();
  }

  onSingleLineComment() {
    this._machine.noop();
  }
}
