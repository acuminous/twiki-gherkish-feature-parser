import Debug from 'debug';
import * as States from './states/index.js';
import { MissingCheckpointBug } from './Errors.js';

const debug = Debug('twiki:gherkish-feature-parser:StateMachine');

export default class StateMachine {

  #featureBuilder;
  #session;
  #currentState;
  #checkpoints = [];
  #history = [];

  constructor({ featureBuilder, session }) {
    this.#featureBuilder = featureBuilder;
    this.#session = session;
    this.#currentState = new States.InitialState({ machine: this, featureBuilder });
    this.#defineStateTransistionHandlers();
  }

  get state() {
    return this.#currentState;
  }

  get history() {
    return this.#history;
  }

  get lastCheckpoint() {
    return this.#checkpoints.slice(-1).pop();
  }

  hasCheckpoint(state) {
    return Boolean(this.#checkpoints.find((checkpoint) => checkpoint === state));
  }

  interpret(source) {
    debug(`[${this.state.name}] Interpretting "${source.line}" at ${source.location}`);
    const event = this.#currentState.getEvent(source, this.#session);
    const data = event.interpret(source, this.#session) || {};
    this.dispatch(event, { source, data });
    return this;
  }

  alias(StateClass) {
    debug(`[${this.state.name}] Aliasing ${StateClass.handlerName} with ${StateClass.handlerAlias}`);
    StateClass.aliasTransitionHandler(this);
    return this;
  }

  checkpoint() {
    debug(`[${this.state.name}] Checkpointing ${this.#currentState.name}`);
    this.#checkpoints.push(this.#currentState);
    return this;
  }

  dispatch(event, context) {
    debug(`[${this.state.name}] Dispatching ${event?.name} to ${this.#currentState.name} with data: %o`, context.data);
    this.#history.push({ state: this.#currentState, event, context });
    event.dispatch(this.#currentState, this.#session, context);
  }

  unwind() {
    const checkpoint = this.#checkpoints.pop();
    if (!checkpoint) throw new MissingCheckpointBug();

    debug(`[${this.state.name}] Unwinding from ${this.#currentState.name} to ${checkpoint.name}`);
    this.#currentState = checkpoint;
    return this;
  }

  noop() {}

  #defineStateTransistionHandlers() {
    Object.values(States).forEach((StateClass) => {
      StateClass.defineTransitionHandler(this, () => {
        const futureState = new StateClass({ machine: this, featureBuilder: this.#featureBuilder });
        debug(`[${this.state.name}] Transitioning to ${futureState.name}`);
        this.#currentState = futureState;
        return this;
      });
    });
  }
}
