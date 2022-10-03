import BaseState from './BaseState.js';
import { AnnotationEvent, BackgroundEvent, BlankLineEvent, DocStringIndentStartEvent, DocStringIndentStopEvent, DocStringTokenStartEvent, DocStringTokenStopEvent, EndEvent, FeatureEvent, BlockCommentEvent, ScenarioEvent, SingleLineCommentEvent, StepEvent } from '../events/index.js';

const events = [EndEvent, DocStringTokenStartEvent, DocStringIndentStartEvent, DocStringTokenStopEvent, DocStringIndentStopEvent, BlockCommentEvent, SingleLineCommentEvent, AnnotationEvent, FeatureEvent, BackgroundEvent, ScenarioEvent, BlankLineEvent, StepEvent];

export default class CreateBackgroundState extends BaseState {
  constructor({ machine, featureBuilder }) {
    super({ machine, events });
    this._featureBuilder = featureBuilder;
    this._annotations = [];
  }

  onAnnotation(event) {
    this._annotations.push({ ...event.data });
  }

  onBlockComment() {
    this._machine.toConsumeBlockCommentState();
  }

  onStep(event) {
    this._featureBuilder.createBackgroundStep({ annotations: this._annotations, ...event.data });
    this._machine.toAfterBackgroundStepState();
  }
}
