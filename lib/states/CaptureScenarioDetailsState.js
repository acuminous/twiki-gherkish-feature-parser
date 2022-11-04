import Debug from 'debug';
import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const debug = Debug('twiki:gherkish-feature-parser:states:CaptureScenarioDetailsState');

const events = [
  new Events.AnnotationEvent({ expected: true }),
  new Events.BackgroundEvent(),
  new Events.BlankLineEvent({ expected: true }),
  new Events.BlockCommentDelimiterEvent({ expected: true }),
  new Events.EndEvent({ expected: true }),
  new Events.ExampleTableEvent({ expected: true }),
  new Events.ExplicitDocstringStartEvent(),
  new Events.ExplicitDocstringStopEvent(),
  new Events.FeatureEvent(),
  new Events.ImplicitDocstringStartEvent(),
  new Events.ImplicitDocstringStopEvent(),
  new Events.ScenarioEvent({ expected: true }),
  new Events.SingleLineCommentEvent({ expected: true }),
  new Events.StepEvent({ expected: true }),
];

export default class CaptureScenarioDetailsState extends BaseState {

  constructor({ machine, featureBuilder }) {
    super({ machine, events, debug });
    this._featureBuilder = featureBuilder;
  }

  onAnnotation(session, event, context) {
    this._machine
      .checkpoint()
      .toCaptureAnnotationState()
      .dispatch(event, context);
  }

  onBlankLine() {
    // Do nothing
  }

  onBlockCommentDelimiter() {
    this._machine
      .checkpoint()
      .toConsumeBlockCommentState();
  }

  onEnd() {
    this._machine.toFinalState();
  }

  onExampleTable() {
    this._machine.toDeclareExampleTableState();
  }

  onSingleLineComment() {
    // Do nothing
  }

  onScenario(session, event, context) {
    this._machine
      .unwind()
      .dispatch(event, context);
  }

  onStep(session, event, context) {
    this._machine.checkpoint()
      .toCaptureScenarioStepState()
      .dispatch(event, context);
  }
}
