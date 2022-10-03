import BaseState from './BaseState.js';

export default class BaseStepState extends BaseState {
  constructor({ machine, featureBuilder, events }) {
    super({ machine, events });
    this._featureBuilder = featureBuilder;
    this._annotations = [];
  }

  onAnnotation(event) {
    this._annotations.push({ ...event.data });
  }

  onMultiLineComment() {
    this._machine.toConsumeMultiLineCommentState();
  }

  onScenario(event) {
    this._featureBuilder.createScenario({ annotations: this._annotations, ...event.data });
    this._machine.toCreateScenarioState();
  }
}
