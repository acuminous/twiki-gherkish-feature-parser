import BaseStepState from './BaseStepState.js';
import { AnnotationEvent, BackgroundEvent, BlankLineEvent, DocStringIndentStartEvent, DocStringIndentStopEvent, DocStringTokenStartEvent, DocStringTokenStopEvent, EndEvent, FeatureEvent, BlockCommentEvent, ScenarioEvent, SingleLineCommentEvent, StepEvent } from '../events/index.js';

const events = [EndEvent, DocStringTokenStartEvent, DocStringIndentStartEvent, DocStringTokenStopEvent, DocStringIndentStopEvent, BlockCommentEvent, SingleLineCommentEvent, AnnotationEvent, FeatureEvent, BackgroundEvent, ScenarioEvent, BlankLineEvent, StepEvent];

export default class AfterBackgroundStepState extends BaseStepState {
  constructor({ machine, featureBuilder }) {
    super({ machine, featureBuilder, events });
  }

  onDocStringIndentStart(event, session) {
    this._machine.toCreateBackgroundStepDocStringState(event);
    this._machine.handle(event.source, session);
  }

  onDocStringTokenStart(event) {
    this._machine.toCreateBackgroundStepDocStringState(event);
  }

  onStep(event) {
    this._featureBuilder.createBackgroundStep({ annotations: this._annotations, ...event.data });
    this._machine.toAfterBackgroundStepState();
  }
}
