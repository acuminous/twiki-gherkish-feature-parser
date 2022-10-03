import BaseState from './BaseState.js';
import { AnnotationEvent, BackgroundEvent, BlankLineEvent, DocStringIndentStartEvent, DocStringIndentStopEvent, DocStringTokenStartEvent, DocStringTokenStopEvent, EndEvent, FeatureEvent, BlockCommentEvent, ScenarioEvent, SingleLineCommentEvent, TextEvent } from '../events/index.js';

const events = [EndEvent, DocStringTokenStartEvent, DocStringIndentStartEvent, DocStringTokenStopEvent, DocStringIndentStopEvent, BlockCommentEvent, SingleLineCommentEvent, AnnotationEvent, FeatureEvent, BackgroundEvent, ScenarioEvent, BlankLineEvent, TextEvent];

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

  onBlockComment() {
    this._machine.toConsumeBlockCommentState();
  }

  onScenario(event) {
    this._featureBuilder.createScenario({ annotations: this._annotations, ...event.data });
    this._machine.toCreateScenarioState();
  }

  onText(event) {
    this._featureBuilder.describeFeature({ ...event.data });
  }
}
