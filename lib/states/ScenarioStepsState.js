import Debug from 'debug';
import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const debug = Debug('twiki:gherkish-feature-parser:states:ScenarioStepsState');

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
  new Events.SingleLineCommentEvent({ expected: true }),
  new Events.ScenarioEvent({ expected: true }),
  new Events.StepEvent({ expected: true }),
];

export default class ScenarioStepsState extends BaseState {

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

  onEnd() {
    this._machine.toFinalState();
  }

  onExampleTable() {
    this._machine.toCreateScenarioExampleTableState();
  }

  onExplicitDocStringStart() {
    this._machine.toCreateScenarioStepExplicitDocStringState();
  }

  onImplicitDocStringStart(session, event, context) {
    this._machine.toCreateScenarioStepImplicitDocStringState();
    this._machine.interpret(context.source, session);
  }

  onScenario(session, event, context) {
    this._featureBuilder.createScenario({ annotations: this._annotations, ...context.data });
    this._machine.toScenarioState();
  }

  onSingleLineComment() {
    // Do nothing
  }

  onStep(session, event, context) {
    this._featureBuilder.createScenarioStep({ annotations: this._annotations, ...context.data });
    this._machine.toScenarioStepsState();
  }
}
