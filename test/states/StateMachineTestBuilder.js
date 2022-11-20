import { strictEqual as eq, deepStrictEqual as deq, throws, ok } from 'node:assert';
import zunit from 'zunit';
import { utils } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

export default class StateMachineTestBuilder {

  beforeEach(fn) {
    beforeEach(fn);
    return this;
  }

  assign(props) {
    Object.assign(this, props);
  }

  interpreting(line, number = 1, indentation = utils.getIndentation(line)) {
    this._source = { line, number, indentation };
    return this;
  }

  shouldTransitionTo(StateClass) {
    const source = this._source;
    it(`${this._printableLine(source)} should cause a transition to ${StateClass.name}`, () => {
      this.machine.interpret(source);
      ok(this.machine.state instanceof StateClass, `Did not transition to ${StateClass.name}`);
    });
    return this;
  }

  shouldNotTransition() {
    const source = this._source;
    it(`${this._printableLine(source)} should not cause a transition`, () => {
      const previousState = this.machine.state;
      this.machine.interpret(source);
      eq(this.machine.state.name, previousState.name);
    });
    return this;
  }

  shouldBeUnexpected(what) {
    const source = this._source;
    it(`${this._printableLine(source)} should be unexpected`, () => {
      throws(() => this.machine.interpret(source), (err) => {
        const eventList = this.expectedEvents.map((EventClass) => ` - ${new EventClass().description}\n`).sort((a, b) => a.localeCompare(b)).join('');
        eq(err.message, `I did not expect ${what} at index.js:1\nInstead, I expected one of:\n${eventList}`);
        return true;
      });
    });
    return this;
  }

  shouldCapture(what, expectations = () => {}) {
    const source = this._source;
    it(`${this._printableLine(source)} should capture ${what}`, () => {
      this.machine.interpret(source);
      expectations(this.featureBuilder.build());
    });
    return this;
  }

  shouldStashAnnotation(expectations = () => {}) {
    const source = this._source;
    it(`${this._printableLine(source)} should stash an annotation`, () => {
      this.machine.interpret(source);
      expectations(this.featureBuilder._annotations);
    });
    return this;
  }

  shouldAlias(StateClass) {
    const source = this._source;
    it(`${this._printableLine(source)} should alias ${StateClass.name} with ${StateClass.alias}`, () => {
      this.machine.interpret(source);
      ok(this.machine[StateClass.handlerAlias], `${StateClass.name} was not aliased with ${StateClass.alias}`);
    });
    return this;
  }

  shouldCheckpoint() {
    const source = this._source;
    it(`${this._printableLine(source)} should create a checkpoint`, () => {
      const previousState = this.machine.state;
      this.machine.interpret(source);
      this.machine.unwind();
      eq(previousState.name, this.machine.state.name);
    });
    return this;
  }

  shouldNotCheckpoint() {
    const source = this._source;
    it(`${this._printableLine(source)} should not create a checkpoint`, () => {
      const previousState = this.machine.state;
      this.machine.interpret(source);
      ok(!this.machine.hasCheckpoint(previousState), 'Created an unexpected checkpoint');
    });
    return this;
  }

  shouldUnwind() {
    const source = this._source;
    it(`${this._printableLine(source)} should unwind to the previous checkpoint`, () => {
      const checkpoint = this.machine.lastCheckpoint;
      this.machine.interpret(source);
      ok(!this.machine.hasCheckpoint(checkpoint), 'Did not unwind to previous checkpoint');
    });
    return this;
  }

  shouldDispatch(EventClass, expectations = () => {}) {
    const source = this._source;
    it(`${this._printableLine(source)} should dispatch ${new EventClass().description} event`, () => {
      this.machine.interpret(source);
      const { event, context } = this.machine.history[this.machine.history.length - 1];
      ok(event instanceof EventClass, `Did not dispatch ${new EventClass().description} event`);
      expectations(context);
    });
    return this;
  }

  _printableLine(source) {
    return source.line === '\u0000' ? '"\\u0000"' : `"${source.line}"`;
  }
}
