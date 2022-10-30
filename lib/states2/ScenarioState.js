import Debug from 'debug';
import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const debug = Debug('twiki:gherkish-feature-parser:states:ScenarioState');

const events = [
  new Events.AnnotationEvent({ expected: true }),
  new Events.BackgroundEvent(),
  new Events.BlankLineEvent({ expected: true }),
  new Events.BlockCommentEvent({ expected: true }),
  new Events.EndEvent(),
  new Events.ExampleTableEvent(),
  new Events.ExplicitDocStringStartEvent(),
  new Events.ExplicitDocStringStopEvent(),
  new Events.FeatureEvent(),
  new Events.ImplicitDocStringStartEvent(),
  new Events.ImplicitDocStringStopEvent(),
  new Events.SingleLineCommentEvent({ expected: true }),
  new Events.ScenarioEvent(),
  new Events.StepEvent({ expected: true }),
];

export default class ScenarioState extends BaseState {

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

  onSingleLineComment() {
    // Do nothing
  }

  onStep(session, event) {
    this._featureBuilder.createScenarioStep({ annotations: this._annotations, ...event.data });
    this._machine.toScenarioStepsState();
  }
}
