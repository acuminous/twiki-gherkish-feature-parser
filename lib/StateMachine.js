import Debug from 'debug';
import FeatureBuilder from './FeatureBuilder.js';
import {
  InitialState,
  CreateFeatureState,
  CreateBackgroundState,
  AfterBackgroundStepDocStringState,
  AfterBackgroundStepState,
  CreateBackgroundStepImplicitDocStringState,
  CreateBackgroundStepExplicitDocStringState,
  CreateScenarioState,
  AfterScenarioStepDocStringState,
  AfterScenarioStepState,
  CreateScenarioStepImplicitDocStringState,
  CreateScenarioStepExplicitDocStringState,
  ConsumeBlockCommentState,
  FinalState,
} from './states/index.js';

const debug = Debug('twiki:gherkish-feature-parser:StateMachine');

export default class StateMachine {

  constructor(props = {}) {
    const { featureBuilder = new FeatureBuilder(), state } = props;
    this._featureBuilder = featureBuilder;
    this._states = state ? [state] : [new InitialState({ machine: this, featureBuilder: this._featureBuilder })];
  }

  get state() {
    return this._getCurrentState().name;
  }

  handle(source, session) {
    this._getCurrentState().handle(source, session);
  }

  build() {
    return this._featureBuilder.build();
  }

  toCreateFeatureState() {
    this._to(new CreateFeatureState({ machine: this, featureBuilder: this._featureBuilder }));
  }

  toCreateBackgroundState() {
    this._to(new CreateBackgroundState({ machine: this, featureBuilder: this._featureBuilder }));
  }

  toAfterBackgroundStepDocStringState() {
    this._to(new AfterBackgroundStepDocStringState({ machine: this, featureBuilder: this._featureBuilder }));
  }

  toAfterBackgroundStepState() {
    this._to(new AfterBackgroundStepState({ machine: this, featureBuilder: this._featureBuilder }));
  }

  toCreateBackgroundStepImplicitDocStringState() {
    this._to(new CreateBackgroundStepImplicitDocStringState({ machine: this, featureBuilder: this._featureBuilder }));
  }

  toCreateBackgroundStepExplicitDocStringState() {
    this._to(new CreateBackgroundStepExplicitDocStringState({ machine: this, featureBuilder: this._featureBuilder }));
  }

  toCreateScenarioState() {
    this._to(new CreateScenarioState({ machine: this, featureBuilder: this._featureBuilder }));
  }

  toAfterScenarioStepDocStringState() {
    this._to(new AfterScenarioStepDocStringState({ machine: this, featureBuilder: this._featureBuilder }));
  }

  toAfterScenarioStepState() {
    this._to(new AfterScenarioStepState({ machine: this, featureBuilder: this._featureBuilder }));
  }

  toCreateScenarioStepImplicitDocStringState() {
    this._to(new CreateScenarioStepImplicitDocStringState({ machine: this, featureBuilder: this._featureBuilder }));
  }

  toCreateScenarioStepExplicitDocStringState() {
    this._to(new CreateScenarioStepExplicitDocStringState({ machine: this, featureBuilder: this._featureBuilder }));
  }

  toConsumeBlockCommentState() {
    this._to(new ConsumeBlockCommentState({ machine: this }));
  }

  toFinalState() {
    this._to(new FinalState({ machine: this, featureBuilder: this._featureBuilder }));
  }

  toPreviousState() {
    this._states.pop();
    const state = this._getCurrentState();
    debug(`Returning to state: ${state.name}`);
  }

  _getCurrentState() {
    return this._states[this._states.length - 1];
  }

  _to(state) {
    debug(`Transitioning to state: ${state.name}`);
    this._states.push(state);
  }
}
