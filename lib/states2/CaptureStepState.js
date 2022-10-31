import Debug from 'debug';
import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const debug = Debug('twiki:gherkish-feature-parser:states:CaptureStepState');

const events = [
  new Events.AnnotationEvent({ expected: true }),
  new Events.BackgroundEvent(),
  new Events.BlankLineEvent({ expected: true }),
  new Events.BlockCommentEvent({ expected: true }),
  new Events.EndEvent({ expected: true }),
  new Events.ExampleTableEvent({ expected: true }),
  new Events.ExplicitDocStringStartEvent({ expected: true }),
  new Events.ExplicitDocStringStopEvent(),
  new Events.FeatureEvent(),
  new Events.ImplicitDocStringStartEvent({ expected: true }),
  new Events.ImplicitDocStringStopEvent(),
  new Events.ScenarioEvent({ expected: true }),
  new Events.SingleLineCommentEvent({ expected: true }),
  new Events.StepEvent({ expected: true }),
];

export default class CaptureStepState extends BaseState {

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

  onBlockComment() {
    this._machine.toBlockCommentState();
  }

  onEnd(session, event, context) {
    this._machine.toPreviousCheckpoint()
      .dispatch(event, context);
  }

  onExampleTable(session, event, context) {
    this._machine.toPreviousCheckpoint()
      .dispatch(event, context);
  }

  onExplicitDocStringStart() {
    throw new Error('Not implemented yet');
  }

  onImplicitDocStringStart() {
    throw new Error('Not implemented yet');
  }

  onSingleLineComment() {
    // Do nothing
  }

  onScenario(session, event, context) {
    this._machine.toPreviousCheckpoint()
      .dispatch(event, context);
  }

  onStep(session, event, context) {
    this._featureBuilder.createStep(context.data);
  }

  onUnexpectedEvent(session, event, context) {
    this._machine.toPreviousCheckpoint()
      .dispatch(event, context);
  }
}