import Debug from 'debug';
import FeatureBuilder from './FeatureBuilder.js';
import * as States from './states/index.js';

const debug = Debug('twiki:gherkish-feature-parser:StateMachine');

export default class StateMachine {

  constructor(props = {}) {
    const { featureBuilder = new FeatureBuilder(), state } = props;
    this._featureBuilder = featureBuilder;
    this._states = state ? [state] : [new States.InitialState({ machine: this, featureBuilder: this._featureBuilder })];
    this._defineStateTransistions();
  }

  get state() {
    return this._getCurrentState().name;
  }

  build() {
    return this._featureBuilder.build();
  }

  handle(source, session) {
    this._getCurrentState().handle(source, session);
  }

  toPreviousState() {
    this._states.pop();
    const state = this._getCurrentState();
    debug(`Returning to state: ${state.name}`);
  }

  _defineStateTransistions() {
    Object.values(States).forEach((StateClass) => {
      const transitionName = StateClass.getTransitionName();
      this[transitionName] = () => {
        const state = new StateClass({ machine: this, featureBuilder: this._featureBuilder });
        debug(`Transitioning to state: ${state.name} via ${transitionName}`);
        this._states.push(state);
      };
    });
  }

  _getCurrentState() {
    return this._states[this._states.length - 1];
  }
}
