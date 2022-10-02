import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import os from 'node:os';
import zunit from 'zunit';
import {  SpecificationParser, Specification, StateMachine, States, Languages } from '../../lib/index.js';

const { describe, it, xdescribe, xit, before, beforeEach, after, afterEach } = zunit;
const { CreateBackgroundStepDocStringState } = States;

describe('CreateBackgroundStepDocStringState', () => {
  let specification;
  let machine;
  let state;
  let session;

  beforeEach(() => {
    specification = new Specification();
    specification.createFeature({ annotations: [], title: 'Meh' });
    specification.createBackground({ annotations: [], title: 'Meh' });
    specification.createBackgroundStep({ annotations: [], text: 'Meh' });

    machine = new StateMachine({ specification });
    machine.toCreateBackgroundStepDocStringState();

    state = new CreateBackgroundStepDocStringState({ specification, machine });

    session = { language: Languages.utils.getDefault(), indentation: 0 };
  });

  describe('Blank Line Events', () => {
    it('should not cause transition', () => {
      session.docString = { token: '---' };
      handle('');
      eq(machine.state, 'CreateBackgroundStepDocStringState');
    });
  });

  describe('DocString Indent Start Events', () => {
    it('should error on DocStringIndentStart event', () => {
      session.indentation = 0;
      throws(() => handle('   Some text'), { message: "'   Some text' was unexpected in state: CreateBackgroundStepDocStringState on line 1'" });
    });
  });

  describe('DocString Indent Stop Events', () => {
    it('should transition to new AfterBackgroundStepDocStringState on DocStringIndentEnd event', () => {
      session.docString = { indentation: 3 };
      session.indentation = 0;
      handle('Some text');
      eq(machine.state, 'AfterBackgroundStepState');
    });
  });

  describe('DocString Token Start Events', () => {
    it('should error on DocStringTokenStart event', () => {
      throws(() => handle('---'), { message: "'---' was unexpected in state: CreateBackgroundStepDocStringState on line 1'" });
    });
  });

  describe('DocString Token Stop Events', () => {
    it('should transition to new AfterBackgroundStepDocStringState on DocStringTokenStop event', () => {
      session.docString = { token: '---' };
      handle('---');
      eq(machine.state, 'AfterBackgroundStepDocStringState');
    });
  });

  describe('End Events', () => {
    it('should transition to final on end event', () => {
      throws(() => handle('\u0000'), { message: 'Premature end of specification in state: CreateBackgroundStepDocStringState on line 1' });
    });
  });

  describe('DocString Events', () => {
    it('should not cause transition', () => {
      session.docString = { token: '---' };
      handle('Some text');
      eq(machine.state, 'CreateBackgroundStepDocStringState');
    });

    it('should capture docstrings', () => {
      session.docString = { token: '---' };
      handle('Some text');
      handle('Some more text');

      const exported = specification.serialise();
      eq(exported.background.steps[0].docString, ['Some text', 'Some more text'].join(os.EOL));
    });
  });

  function handle(line, number = 1, indentation = SpecificationParser.getIndentation(line)) {
    state.handle({ line, number, indentation }, session);
  }
});
