import BaseState from './BaseState.js';

export default class BaseStepState extends BaseState {
  constructor({ machine, specification, events }) {
    super({ machine, events });
    this._specification = specification;
    this._annotations = [];
  }

  onAnnotation(event) {
    this._annotations.push({ ...event.data });
  }

  onMultiLineComment() {
    this._machine.toConsumeMultiLineCommentState();
  }

  onScenario(event) {
    this._specification.createScenario({ annotations: this._annotations, ...event.data });
    this._machine.toCreateScenarioState();
  }
};
