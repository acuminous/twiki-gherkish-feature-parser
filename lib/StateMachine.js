import Debug from 'debug';
import Specification from './Specification.js';
import {
  InitialState,
  CreateFeatureState,
  CreateBackgroundState,
  AfterBackgroundStepDocStringState,
  AfterBackgroundStepState,
  CreateBackgroundStepDocStringState,
  CreateScenarioState,
  AfterScenarioStepDocStringState,
  AfterScenarioStepState,
  CreateScenarioStepDocStringState,
  ConsumeMultiLineCommentState,
  FinalState,
} from './states/index.js';

export default class StateMachine {
  constructor(props = {}) {
    const { specification = new Specification(), state, debug = Debug('yadda:gherkish:StateMachine') } = props;

    this._specification = specification;
    this._states = state ? [state] : [new InitialState({ machine: this, specification: this._specification })];
    this._debug = debug;
  }

  get specification() {
    return this._specification;
  }

  get state() {
    return this._getCurrentState().name;
  }

  handle(source, session) {
    this._getCurrentState().handle(source, session);
  }

  toCreateFeatureState() {
    this._to(new CreateFeatureState({ machine: this, specification: this._specification }));
  }

  toCreateBackgroundState() {
    this._to(new CreateBackgroundState({ machine: this, specification: this._specification }));
  }

  toAfterBackgroundStepDocStringState() {
    this._to(new AfterBackgroundStepDocStringState({ machine: this, specification: this._specification }));
  }

  toAfterBackgroundStepState() {
    this._to(new AfterBackgroundStepState({ machine: this, specification: this._specification }));
  }

  toCreateBackgroundStepDocStringState() {
    this._to(new CreateBackgroundStepDocStringState({ machine: this, specification: this._specification }));
  }

  toCreateScenarioState() {
    this._to(new CreateScenarioState({ machine: this, specification: this._specification }));
  }

  toAfterScenarioStepDocStringState() {
    this._to(new AfterScenarioStepDocStringState({ machine: this, specification: this._specification }));
  }

  toAfterScenarioStepState() {
    this._to(new AfterScenarioStepState({ machine: this, specification: this._specification }));
  }

  toCreateScenarioStepDocStringState() {
    this._to(new CreateScenarioStepDocStringState({ machine: this, specification: this._specification }));
  }

  toConsumeMultiLineCommentState() {
    this._to(new ConsumeMultiLineCommentState({ machine: this }));
  }

  toFinalState() {
    this._to(new FinalState({ machine: this, specification: this._specification }));
  }

  toPreviousState() {
    this._states.pop();
    const state = this._getCurrentState();
    this._debug(`Returning to state: ${state.name}`);
  }

  _getCurrentState() {
    return this._states[this._states.length - 1];
  }

  _to(state) {
    this._debug(`Transitioning to state: ${state.name}`);
    this._states.push(state);
  }
};
