import Debug from 'debug';
import FeatureBuilder from './FeatureBuilder.js';
import * as States from './states/index.js';
import * as States2 from './states2/index.js';

const debug = Debug('twiki:gherkish-feature-parser:StateMachine');

export default class StateMachine {

  constructor(props = {}, useStates2 = false) {
    this._useStates2 = useStates2;
    const { featureBuilder = new FeatureBuilder(), session = {} } = props;
    this._featureBuilder = featureBuilder;
    this._session = session;
    this._states = this._useStates2 ? [new States2.InitialState({ machine: this, featureBuilder: this._featureBuilder })] : [new States.InitialState({ machine: this, featureBuilder: this._featureBuilder })];
    this._checkpoints = [];
    this._defineStateTransistions();
  }

  get state() {
    return this._getCurrentState().name;
  }

  build() {
    return this._featureBuilder.build();
  }

  handle(source) {
    this._getCurrentState().handle(source, this._session);
  }

  checkpoint() {
    this._checkpoints.push(this._getCurrentState());
  }

  toPreviousState() {
    this._states.pop();
    const state = this._getCurrentState();
    debug(`Returning to state: ${state.name}`);
  }

  toPreviousCheckpoint() {
    while (this._getCurrentState() !== this._getCurrentCheckpoint()) this.toPreviousState();
    this._checkpoint.pop();
  }

  _defineStateTransistions() {
    Object.values(this._useStates2 ? States2 : States).forEach((StateClass) => {
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

  _getCurrentCheckpoint() {
    return this._states[this._states.length - 1];
  }
}
