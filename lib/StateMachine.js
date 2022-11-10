import fs from 'node:fs';
import path from 'node:path';
import Debug from 'debug';
import * as States from './states/index.js';

const packageJsonUrl = new URL(path.join('..', 'package.json'), import.meta.url);
const pkg = JSON.parse(fs.readFileSync(packageJsonUrl));

const debug = Debug('twiki:gherkish-feature-parser:StateMachine');

export default class StateMachine {

  constructor(props = {}) {
    this._featureBuilder = props.featureBuilder;
    this._session = props.session;
    this._currentState = new States.InitialState({ machine: this, featureBuilder: this._featureBuilder });
    this._checkpoints = [];
    this._defineStateTransistionHandlers();
  }

  get state() {
    return this._currentState.name;
  }

  interpret(source) {
    debug(`Interpretting "${source.line}"`);
    const event = this._currentState.getEvent(source, this._session);
    const data = event.interpret(source, this._session) || {};
    this.dispatch(event, { source, data });
    return this;
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

  unwind() {
    const checkpoint = this._checkpoints.pop();
    if (!checkpoint) throw new Error(`The state machine has been asked to unwind but no checkpoint exists. This is a bug in ${pkg.name}. Please file a bug report at ${pkg.bugs.url}`);

    debug(`Unwinding from ${this._currentState.name} to ${checkpoint.name}`);
    this._currentState = checkpoint;
    return this;
  }

  noop() {
  }

  _defineStateTransistionHandlers() {
    Object.values(States).forEach((StateClass) => {
      StateClass.defineTransitionHandler(this, () => {
        const futureState = new StateClass({ machine: this, featureBuilder: this._featureBuilder });
        debug(`Transitioning from ${this._currentState.name} to ${futureState.name}`);
        this._currentState = futureState;
        return this;
      });
    });
  }
}
