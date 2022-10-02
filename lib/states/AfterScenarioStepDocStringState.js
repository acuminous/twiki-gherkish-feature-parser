import BaseStepState from './BaseStepState.js';
import { AnnotationEvent, BackgroundEvent, BlankLineEvent, DocStringIndentStartEvent, DocStringIndentStopEvent, DocStringTokenStartEvent, DocStringTokenStopEvent, EndEvent, FeatureEvent, LanguageEvent, MultiLineCommentEvent, ScenarioEvent, SingleLineCommentEvent, StepEvent } from '../events/index.js';

const events = [EndEvent, DocStringTokenStartEvent, DocStringTokenStopEvent, DocStringIndentStartEvent, DocStringIndentStopEvent, LanguageEvent, MultiLineCommentEvent, SingleLineCommentEvent, AnnotationEvent, FeatureEvent, BackgroundEvent, ScenarioEvent, BlankLineEvent, StepEvent];

export default class AfterScenarioStepDocStringState extends BaseStepState {
  constructor({ machine, specification }) {
    super({ machine, specification, events });
  }

  onEnd() {
    this._machine.toFinalState();
  }

  onStep(event) {
    this._specification.createScenarioStep({ annotations: this._annotations, ...event.data });
    this._machine.toAfterScenarioStepState();
  }
}
