import Debug from 'debug';
import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const debug = Debug('twiki:gherkish-feature-parser:states:CaptureBackgroundStepState');

const events = [
  new Events.AnnotationEvent({ expected: true }),
  new Events.BackgroundEvent(),
  new Events.BlankLineEvent({ expected: true }),
  new Events.BlockCommentDelimiterEvent({ expected: true }),
  new Events.EndEvent(),
  new Events.ExampleTableEvent(),
  new Events.ExplicitDocStringStartEvent({ expected: true }),
  new Events.ExplicitDocStringStopEvent(),
  new Events.FeatureEvent(),
  new Events.ImplicitDocStringStartEvent({ expected: true }),
  new Events.ImplicitDocStringStopEvent(),
  new Events.ScenarioEvent({ expected: true }),
  new Events.SingleLineCommentEvent({ expected: true }),
  new Events.StepEvent({ expected: true }),
];

export default class CaptureBackgroundStepState extends BaseState {

  constructor({ machine, featureBuilder }) {
    super({ machine, events, debug });
    this._featureBuilder = featureBuilder;
  }

  onAnnotation(session, event, context) {
    this._featureBuilder.stashAnnotation(context.data);
  }

  onBlankLine() {
    // Do nothing
  }

  onBlockCommentDelimiter() {
    this._machine.checkpoint()
      .toConsumeBlockCommentState();
  }

  onExplicitDocStringStart() {
    this._machine.toBeginExplicitDocstringState();
  }

  onImplicitDocStringStart(session, event, context) {
    this._machine.toCaptureImplicitDocstringState();
    this._machine.interpret(context.source);
  }

  onSingleLineComment() {
    // Do nothing
  }

  onScenario(session, event, context) {
    this._machine.unwind()
      .dispatch(event, context);
  }

  onStep(session, event, context) {
    this._featureBuilder.createStep(context.data);
  }
}
