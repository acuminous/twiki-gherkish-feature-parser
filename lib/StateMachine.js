import Debug from 'debug';
import FeatureBuilder from './FeatureBuilder.js';
import Session from './Session.js';
import * as States from './states/index.js';
import * as States2 from './states2/index.js';

const debug = Debug('twiki:gherkish-feature-parser:StateMachine');

export default class StateMachine {

  constructor(props = {}, useStates2 = false) {
    this._useStates2 = useStates2;
    this._featureBuilder = props.featureBuilder || new FeatureBuilder();
    this._session = props.session || new Session();
    this._states = this._useStates2 ? [new States2.InitialState({ machine: this, featureBuilder: this._featureBuilder })] : [new States.InitialState({ machine: this, featureBuilder: this._featureBuilder })];
    this._checkpoints = [];
    this._defineStateTransistionHandlers();
  }

  get state() {
    return this._getCurrentState().name;
  }

  build() {
    return this._featureBuilder.build();
  }

  interpret(source) {
    debug(`Interpretting "${source.line}"`);
    const event = this._getCurrentState().getEvent(source, this._session);
    const data = event.interpret(source, this._session);
    this.dispatch(event, { source, data });
  }

  checkpoint() {
    const currentState = this._getCurrentState();
    debug(`Checkpointing ${currentState?.name}`);
    this._checkpoints.push(currentState);
    return this;
  }

  dispatch(event, context) {
    const currentState = this._getCurrentState();
    debug(`Dispatching ${event?.name} to ${currentState?.name} with data: %o`, context.data);
    event.dispatch(currentState, this._session, context);
  }

  toPreviousState() {
    this._states.pop();
    return this;
  }

  toPreviousCheckpoint() {
    const previousState = this._getCurrentState();
    const checkpointState = this._checkpoints.pop();
    debug(`Unwinding from ${previousState?.name} to ${checkpointState?.name}`);
    while (this._getCurrentState() !== checkpointState) this._states.pop();
    return this;
  }

  _defineStateTransistionHandlers() {
    Object.values(this._useStates2 ? States2 : States).forEach((StateClass) => {
      StateClass.defineTransitionHandler(this, () => {
        const currentState = this._getCurrentState();
        const futureState = new StateClass({ machine: this, featureBuilder: this._featureBuilder });
        debug(`Transitioning from ${currentState?.name} to ${futureState?.name}`);
        this._states.push(futureState);
        return this;
      });
    });
  }

  _getCurrentState() {
    return this._states[this._states.length - 1];
  }

  _getCurrentCheckpoint() {
    return this._checkpoints[this._checkpoints.length - 1];
  }
}
