import Debug from 'debug';
import * as States from './states/index.js';
import { MissingCheckpointBug } from './Errors.js';

const debug = Debug('twiki:gherkish-feature-parser:StateMachine');

export default class StateMachine {

  constructor(props = {}) {
    this._featureBuilder = props.featureBuilder;
    this._session = props.session;
    this._currentState = new States.InitialState({ machine: this, featureBuilder: this._featureBuilder });
    this._checkpoints = [];
    this._history = [];
    this._defineStateTransistionHandlers();
  }

  get state() {
    return this._currentState;
  }

  get history() {
    return this._history;
  }

  get lastCheckpoint() {
    return this._checkpoints.slice(-1).pop();
  }

  hasCheckpoint(state) {
    return Boolean(this._checkpoints.find((checkpoint) => checkpoint === state));
  }

  interpret(source) {
    debug(`[${this.state}] Interpretting "${source.line}"`);
    const event = this._currentState.getEvent(source, this._session);
    const data = event.interpret(source, this._session) || {};
    this.dispatch(event, { source, data });
    return this;
  }

  alias(StateClass) {
    debug(`[${this.state}] Aliasing ${StateClass.handlerName} with ${StateClass.handlerAlias}`);
    StateClass.aliasTransitionHandler(this);
    return this;
  }

  checkpoint() {
    debug(`[${this.state}] Checkpointing ${this._currentState.name}`);
    this._checkpoints.push(this._currentState);
    return this;
  }

  dispatch(event, context) {
    debug(`[${this.state}] Dispatching ${event?.name} to ${this._currentState.name} with data: %o`, context.data);
    this._history.push({ state: this._currentState, event, context });
    event.dispatch(this._currentState, this._session, context);
  }

  unwind() {
    const checkpoint = this._checkpoints.pop();
    if (!checkpoint) throw new MissingCheckpointBug();

    debug(`[${this.state}] Unwinding from ${this._currentState.name} to ${checkpoint.name}`);
    this._currentState = checkpoint;
    return this;
  }

  noop() {}

  _defineStateTransistionHandlers() {
    Object.values(States).forEach((StateClass) => {
      StateClass.defineTransitionHandler(this, () => {
        const futureState = new StateClass({ machine: this, featureBuilder: this._featureBuilder });
        debug(`[${this.state}] Transitioning to ${futureState.name}`);
        this._currentState = futureState;
        return this;
      });
    });
  }
}
