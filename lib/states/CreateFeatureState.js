import BaseState from './BaseState.js';
import { AnnotationEvent, BackgroundEvent, BlankLineEvent, DocStringIndentStartEvent, DocStringIndentStopEvent, DocStringTokenStartEvent, DocStringTokenStopEvent, EndEvent, FeatureEvent, MultiLineCommentEvent, ScenarioEvent, SingleLineCommentEvent, TextEvent } from '../events/index.js';

const events = [EndEvent, DocStringTokenStartEvent, DocStringIndentStartEvent, DocStringTokenStopEvent, DocStringIndentStopEvent, MultiLineCommentEvent, SingleLineCommentEvent, AnnotationEvent, FeatureEvent, BackgroundEvent, ScenarioEvent, BlankLineEvent, TextEvent];

export default class CreateFeatureState extends BaseState {
  constructor({ machine, featureBuilder }) {
    super({ machine, events });
    this._featureBuilder = featureBuilder;
    this._annotations = [];
  }

  onAnnotation(event) {
    this._annotations.push({ ...event.data });
  }

  onBackground(event) {
    this._featureBuilder.createBackground({ annotations: this._annotations, ...event.data });
    this._machine.toCreateBackgroundState();
  }

  onMultiLineComment() {
    this._machine.toConsumeMultiLineCommentState();
  }

  onScenario(event) {
    this._featureBuilder.createScenario({ annotations: this._annotations, ...event.data });
    this._machine.toCreateScenarioState();
  }

  onText(event) {
    this._featureBuilder.describeFeature({ ...event.data });
  }
}
