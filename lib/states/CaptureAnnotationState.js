import Debug from 'debug';
import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const debug = Debug('twiki:gherkish-feature-parser:states:CaptureAnnotationState');

const events = [
  new Events.AnnotationEvent({ expected: true }),
  new Events.BackgroundEvent({ expected: true }),
  new Events.BlankLineEvent({ expected: true }),
  new Events.BlockCommentDelimiterEvent({ expected: true }),
  new Events.EndEvent({ expected: true }),
  new Events.ExampleTableEvent({ expected: true }),
  new Events.ExplicitDocstringStartEvent({ expected: true }),
  new Events.FeatureEvent({ expected: true }),
  new Events.ImplicitDocstringStartEvent({ expected: true }),
  new Events.RuleEvent({ expected: true }),
  new Events.ScenarioEvent({ expected: true }),
  new Events.SingleLineCommentEvent({ expected: true }),
  new Events.StepEvent({ expected: true }),
];

export default class CaptureAnnotationState extends BaseState {

  constructor({ machine, featureBuilder }) {
    super({ machine, featureBuilder, events, debug });
  }

  onAnnotation(session, event, context) {
    this._featureBuilder.stashAnnotation(context.data);
  }

  onBackground(session, event, context) {
    this._machine.toEndAnnotationState().dispatch(event, context);
  }

  onBlankLine(session, event, context) {
    this._machine.toEndAnnotationState().dispatch(event, context);
  }

  onBlockCommentDelimiter(session, event, context) {
    this._machine.toEndAnnotationState().dispatch(event, context);
  }

  onEnd(session, event, context) {
    this._machine.toEndAnnotationState().dispatch(event, context);
  }

  onExampleTable(session, event, context) {
    this._machine.toEndAnnotationState().dispatch(event, context);
  }

  onExplicitDocstringStart(session, event, context) {
    this._machine.toEndAnnotationState().dispatch(event, context);
  }

  onImplicitDocstringStart(session, event, context) {
    this._machine.toEndAnnotationState().dispatch(event, context);
  }

  onFeature(session, event, context) {
    this._machine.toEndAnnotationState().dispatch(event, context);
  }

  onRule(session, event, context) {
    this._machine.toEndAnnotationState().dispatch(event, context);
  }

  onScenario(session, event, context) {
    this._machine.toEndAnnotationState().dispatch(event, context);
  }

  onSingleLineComment(session, event, context) {
    this._machine.toEndAnnotationState().dispatch(event, context);
  }

  onStep(session, event, context) {
    this._machine.toEndAnnotationState().dispatch(event, context);
  }
}
