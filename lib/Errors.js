/* eslint max-classes-per-file: 0 */

import Package from './Package.js';

class TwikiError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

class TwikiBug extends TwikiError {
  constructor(message, code) {
    super(`${message} - Please file a bug report at ${Package.issues}`, code);
  }
}

class TwikiPullRequest extends TwikiError {
  constructor(message, code) {
    super(`${message} - Please submit a pull request at ${Package.pulls}`, code);
  }
}

// Event Errors
export class UnexpectedEventError extends TwikiError {
  static code = `${Package.name}/event/001`;

  constructor(state, session, event, context) {
    const message = `I did not expect ${event.description} at ${session.metadata?.source?.uri}:${context.source.number}\nInstead, I expected one of:\n${state.describeExpectedEvents()}`;
    super(message, UnexpectedEventError.code);
  }
}

export class MissingEventHandlerBug extends TwikiBug {
  static code = `${Package.name}/event/002`;

  constructor(state, session, event, context) {
    const message = `${state.name} has no event handler for '${context.source.line}' at ${session.metadata?.source?.uri}:${context.source.number}`;
    super(message, MissingEventHandlerBug.code);
  }
}

export class UnexpectedNumberOfColumns extends TwikiError {
  static code = `${Package.name}/event/003`;

  constructor(source, session, numberOfColumns) {
    const message = `Expected ${session.numberOfExamples} columns but found ${numberOfColumns} at ${session.metadata?.source?.uri}:${source.number}`;
    super(message, UnexpectedNumberOfColumns.code);
  }
}

export class UnexpectedNumberOfExamples extends TwikiError {
  static code = `${Package.name}/event/004`;

  constructor(source, session, numberOfExamples) {
    const message = `Expected ${session.numberOfExamples} examples but found ${numberOfExamples} at ${session.metadata?.source?.uri}:${source.number}`;
    super(message, UnexpectedNumberOfExamples.code);
  }
}

// State Machine Errors
export class MissingCheckpointBug extends TwikiBug {
  static code = `${Package.name}/state/001`;

  constructor() {
    const message = 'The state machine has been asked to unwind but no checkpoint exists';
    super(message, MissingCheckpointBug.code);
  }
}

// State Errors
export class MissingHandlerBug extends TwikiBug {
  static code = `${Package.name}/state-machine/001`;

  constructor(state, handlerName) {
    const message = `${state.name} is missing an ${handlerName} event handler`;
    super(message, MissingHandlerBug.code);
  }
}

export class RedundantHandlerBug extends TwikiBug {
  static code = `${Package.name}/state-machine/002`;

  constructor(state, handlerName) {
    const message = `${state.name} has a redundant ${handlerName} event handler`;
    super(message, RedundantHandlerBug.code);
  }
}

export class MissingStateAlias extends TwikiBug {
  static code = `${Package.name}/state-machine/003`;

  constructor(state) {
    const message = `${state.name} is not aliased`;
    super(message, MissingStateAlias.code);
  }
}

// Language Errors
export class MissingTranslationPullRequest extends TwikiPullRequest {
  static code = `${Package.name}/language/001`;

  constructor(language, keyword) {
    const message = `${language.name} is missing a translation for the "${keyword}" keyword`;
    super(message, MissingTranslationPullRequest.code);
  }
}
