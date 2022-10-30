import Debug from 'debug';
import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const debug = Debug('twiki:gherkish-feature-parser:states:BackgroundStepsState');

const events = [
  new Events.AnnotationEvent({ expected: true }),
  new Events.BackgroundEvent(),
  new Events.BlankLineEvent({ expected: true }),
  new Events.BlockCommentEvent({ expected: true }),
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

export default class BackgroundStepsState extends BaseState {

  constructor({ machine, featureBuilder }) {
    super({ machine, events, debug });
    this._featureBuilder = featureBuilder;
    this._annotations = [];
  }

  onAnnotation(session, event, context) {
    this._annotations.push({ ...context.data });
  }

  onBlankLine() {
    // Do nothing
  }

  onBlockComment() {
    this._machine.toBlockCommentState();
  }

  onImplicitDocStringStart(session, event, context) {
    this._machine.toCreateBackgroundStepImplicitDocStringState(event);
    this._machine.interpret(context.source, session);
  }

  onExplicitDocStringStart() {
    this._machine.toCreateBackgroundStepExplicitDocStringState();
  }

  onSingleLineComment() {
    // Do nothing
  }

  onScenario(session, event, context) {
    this._featureBuilder.createScenario({ annotations: this._annotations, ...context.data });
    this._machine.toScenarioState();
  }

  onStep(session, event, context) {
    this._featureBuilder.createBackgroundStep({ annotations: this._annotations, ...context.data });
    this._machine.toBackgroundStepsState();
  }
}
