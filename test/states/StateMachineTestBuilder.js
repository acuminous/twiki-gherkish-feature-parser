import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import zunit from 'zunit';
import { utils } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

export default class StateMachineTestBuilder {

  before(fn) {
    before(fn);
    return this;
  }

  beforeEach(fn) {
    beforeEach(fn);
    return this;
  }

  after(fn) {
    after(fn);
    return this;
  }

  afterEach(fn) {
    afterEach(fn);
    return this;
  }

  interpreting(line, number = 1, indentation = utils.getIndentation(line)) {
    this._source = { line, number, indentation };
    return this;
  }

  shouldTransitionTo(destination) {
    const source = this._source;
    it(`${this._printableLine(source)} should cause a transition to ${destination.name}`, () => {
      this.machine.interpret(source);
      eq(this.machine.state, destination.name);
    });
    return this;
  }

  shouldNotTransition() {
    const source = this._source;
    it(`${this._printableLine(source)} should not cause a transition`, () => {
      const current = this.machine.state;
      this.machine.interpret(source);
      eq(this.machine.state, current);
    });
    return this;
  }

  shouldBeUnexpected(what) {
    const source = this._source;
    it(`${this._printableLine(source)} should be unexpected`, () => {
      throws(() => this.machine.interpret(source), (err) => {
        const eventList = this.expectedEvents.map((Clazz) => ` - ${new Clazz().description}\n`).sort((a, b) => a.localeCompare(b)).join('');
        eq(err.message, `I did not expect ${what} at index.js:1\nInstead, I expected one of:\n${eventList}`);
        return true;
      });
    });
    return this;
  }

  shouldCapture(what, expectations) {
    const source = this._source;
    it(`${this._printableLine(source)} should capture ${what}`, () => {
      this.machine.interpret(source);
      expectations(this.featureBuilder.build());
    });
    return this;
  }

  shouldStashAnnotation(expectations) {
    const source = this._source;
    it(`${this._printableLine(source)} should stash an annotation`, () => {
      this.machine.interpret(source);
      expectations(this.featureBuilder._annotations);
    });
    return this;
  }

  shouldCreateACheckpoint() {
    const source = this._source;
    it(`${this._printableLine(source)} should create a checkpoint`, () => {
      const currentState = this.machine.state;
      this.machine.interpret(source).unwind();
      eq(this.machine.state, currentState);
    });
    return this;
  }

  _printableLine(source) {
    return source.line === '\u0000' ? '"\\u0000"' : `"${source.line}"`;
  }
}
