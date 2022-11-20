/* eslint max-classes-per-file: 0 */

import fs from 'node:fs';
import path from 'node:path';

const packageJsonUrl = new URL(path.join('..', 'package.json'), import.meta.url);
const pkg = JSON.parse(fs.readFileSync(packageJsonUrl));

class TwikiError extends Error {
  constructor(message, code) {
    super(message);
    this._code = code;
  }

  get code() {
    return this;
  }
}

class TwikiBug extends TwikiError {
  constructor(message, code) {
    super(`${message} - Please file a bug report at ${pkg.bugs.url}`, code);
  }
}

class TwikiPullRequest extends TwikiError {
  constructor(message, code) {
    super(`${message} - Please submit a pull request to ${pkg.bugs.url.replace(/\/issues/, '')}`, code);
  }
}

// Event Errors
export class UnexpectedEventError extends TwikiError {
  static code = `${pkg.name}-00100`;

  constructor(state, session, event, context) {
    const message = `I did not expect ${event.description} at ${session.metadata?.source?.uri}:${context.source.number}\nInstead, I expected one of:\n${state.describeExpectedEvents()}`;
    super(message, UnexpectedEventError.code);
  }
}

export class MissingEventHandlerError extends TwikiError {
  static code = `${pkg.name}-00101`;

  constructor(state, session, event, context) {
    const message = `${state.name} has no event handler for '${context.source.line}' at ${session.metadata?.source?.uri}:${context.source.number}`;
    super(message, MissingEventHandlerError.code);
  }
}

export class UnexpectedNumberOfColumns extends TwikiError {
  static code = `${pkg.name}-00102`;

  constructor(source, session, numberOfColumns) {
    const message = `Expected ${session.numberOfExamples} columns but found ${numberOfColumns} at ${session.metadata?.source?.uri}:${source.number}`;
    super(message, UnexpectedNumberOfExamples.code);
  }
}

export class UnexpectedNumberOfExamples extends TwikiError {
  static code = `${pkg.name}-00103`;

  constructor(source, session, numberOfExamples) {
    const message = `Expected ${session.numberOfExamples} examples but found ${numberOfExamples} at ${session.metadata?.source?.uri}:${source.number}`;
    super(message, UnexpectedNumberOfExamples.code);
  }
}

// State Machine Errors
export class MissingCheckpointBug extends TwikiBug {
  static code = `${pkg.name}-00200`;

  constructor() {
    const message = 'The state machine has been asked to unwind but no checkpoint exists';
    super(message, MissingCheckpointBug.code);
  }
}

// State Errors
export class MissingHandlerBug extends TwikiBug {
  static code = `${pkg.name}-00300`;

  constructor(state, handlerName) {
    const message = `${state.name} is missing an ${handlerName} event handler`;
    super(message, MissingHandlerBug.code);
  }
}

export class RedundantHandlerBug extends TwikiBug {
  static code = `${pkg.name}-00301`;

  constructor(state, handlerName) {
    const message = `${state.name} has a redundant ${handlerName} event handler`;
    super(message, RedundantHandlerBug.code);
  }
}

export class MissingStateAlias extends TwikiBug {
  static code = `${pkg.name}-00302`;

  constructor(state) {
    const message = `${state.name} is not aliased`;
    super(message, MissingStateAlias.code);
  }
}

// Language Errors
export class MissingTranslationPullRequest extends TwikiPullRequest {
  static code = `${pkg.name}-00400`;

  constructor(language, keyword) {
    const message = `${language.name} is missing a translation for the "${keyword}" keyword`;
    super(message, MissingTranslationPullRequest.code);
  }
}
