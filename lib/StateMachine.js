import fs from 'node:fs';
import Debug from 'debug';
import FeatureBuilder from './FeatureBuilder.js';
import Session from './Session.js';
import * as States from './states2/index.js';

const packageJsonUrl = new URL('../package.json', import.meta.url);
const pkg = JSON.parse(fs.readFileSync(packageJsonUrl));

const debug = Debug('twiki:gherkish-feature-parser:StateMachine');

export default class StateMachine {

  constructor(props = {}) {
    this._featureBuilder = props.featureBuilder || new FeatureBuilder();
    this._session = props.session || new Session();
    this._states = [new States.InitialState({ machine: this, featureBuilder: this._featureBuilder })];
    this._checkpoints = [];
    this._defineStateTransistionHandlers();
  }

  get state() {
    return this._currentState.name;
  }

  get _currentState() {
    const state = this._states[this._states.length - 1];
    if (!state) throw new Error(`The state machine stack is empty. This is a bug in ${pkg.name}. Please file a bug report at ${pkg.bugs.url}`);
    return state;
  }

  get _currentCheckpoint() {
    const checkpoint = this._checkpoints[this._checkpoints.length - 1];
    if (!checkpoint) throw new Error(`The state machine has been asked to unwind but no checkpoint exists. This is a bug in ${pkg.name}. Please file a bug report at ${pkg.bugs.url}`);
    return checkpoint;
  }

  build() {
    return this._featureBuilder.build();
  }

  interpret(source) {
    debug(`Interpretting "${source.line}"`);
    const event = this._currentState.getEvent(source, this._session);
    const data = event.interpret(source, this._session);
    this.dispatch(event, { source, data });
  }

  checkpoint() {
    debug(`Checkpointing ${this._currentState.name}`);
    this._checkpoints.push(this._currentState);
    return this;
  }

  dispatch(event, context) {
    debug(`Dispatching ${event?.name} to ${this._currentState.name} with data: %o`, context.data);
    event.dispatch(this._currentState, this._session, context);
  }

  toPreviousState() {
    this._states.pop();
    return this;
  }

  toPreviousCheckpoint() {
    debug(`Unwinding from ${this._currentState.name} to ${this._currentCheckpoint.name}`);
    while (this._currentState !== this._currentCheckpoint) this._states.pop();
    this._checkpoints.pop();
    return this;
  }

  _defineStateTransistionHandlers() {
    Object.values(States).forEach((StateClass) => {
      StateClass.defineTransitionHandler(this, () => {
        const futureState = new StateClass({ machine: this, featureBuilder: this._featureBuilder });
        debug(`Transitioning from ${this._currentState.name} to ${futureState.name}`);
        this._states.push(futureState);
        return this;
      });
    });
  }
}
