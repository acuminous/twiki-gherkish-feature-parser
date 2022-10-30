import Debug from 'debug';
import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const debug = Debug('twiki:gherkish-feature-parser:states:DeclareBackgroundState');

const events = [
  new Events.AnnotationEvent({ expected: true }),
  new Events.BackgroundEvent(),
  new Events.BlankLineEvent({ expected: true }),
  new Events.BlockCommentEvent({ expected: true }),
  new Events.ExampleTableEvent(),
  new Events.ExplicitDocStringStartEvent(),
  new Events.ImplicitDocStringStartEvent(),
  new Events.ExplicitDocStringStopEvent(),
  new Events.ImplicitDocStringStopEvent(),
  new Events.EndEvent(),
  new Events.FeatureEvent(),
  new Events.SingleLineCommentEvent({ expected: true }),
  new Events.ScenarioEvent(),
  new Events.StepEvent({ expected: true }),
];

export default class DeclareBackgroundState extends BaseState {

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

  onSingleLineComment() {
    // Do nothing
  }

  onStep(session, event, context) {
    this._featureBuilder.createBackgroundStep({ ...context.data });
    this._machine.toCaptureStepState();
    this._machine.dispatch(event);
  }
}
