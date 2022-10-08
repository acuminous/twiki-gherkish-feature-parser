import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const events = [
  new Events.AnnotationEvent({ expected: true }),
  new Events.BackgroundEvent(),
  new Events.BlankLineEvent({ expected: true }),
  new Events.BlockCommentEvent({ expected: true }),
  new Events.DocStringTokenStartEvent(),
  new Events.DocStringIndentStartEvent(),
  new Events.DocStringTokenStopEvent(),
  new Events.DocStringIndentStopEvent(),
  new Events.EndEvent(),
  new Events.FeatureEvent(),
  new Events.ScenarioEvent(),
  new Events.SingleLineCommentEvent({ expected: true }),
  new Events.StepEvent({ expected: true }),
];

export default class CreateScenarioState extends BaseState {

  constructor({ machine, featureBuilder }) {
    super({ machine, events });
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
    this._machine.toConsumeBlockCommentState();
  }

  onSingleLineComment() {
    // Do nothing
  }

  onStep(session, event) {
    this._featureBuilder.createScenarioStep({ annotations: this._annotations, ...event.data });
    this._machine.toAfterScenarioStepState();
  }
}
