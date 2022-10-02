import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import os from 'node:os';
import zunit from 'zunit';
import { SpecificationParser, Languages, StateMachine } from '../lib/index.js';
import StubState from './stubs/StubState.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('Specification Parser', () => {
  it('should parse specifications using the default language (none)', () => {
    const text = [
      '@skip',
      'Feature: Some feature',
      '',
      'Some free form text',
      '',
      '   @timeout=1000',
      '   Background: The background',
      '      First background step',
      '',
      '   @browser = Firefox',
      '   Scenario: First scenario',
      '      First step',
      '      Second step',
      '',
      '   Scenario: Second scenario',
      '      Third step',
      '      Fourth step',
    ].join(os.EOL);

    const document = new SpecificationParser().parse(text);

    eq(document.description, 'Some free form text');
    eq(document.annotations[0].name, 'skip');
    eq(document.annotations[0].value, true);
    eq(document.title, 'Some feature');
    eq(document.background.annotations[0].name, 'timeout');
    eq(document.background.annotations[0].value, '1000');
    eq(document.background.title, 'The background');
    eq(document.background.steps[0].text, 'First background step');
    eq(document.scenarios[0].annotations[0].name, 'browser');
    eq(document.scenarios[0].annotations[0].value, 'Firefox');
    eq(document.scenarios[0].title, 'First scenario');
    eq(document.scenarios[0].steps[0].text, 'First step');
    eq(document.scenarios[0].steps[1].text, 'Second step');
    eq(document.scenarios[1].title, 'Second scenario');
    eq(document.scenarios[1].steps[0].text, 'Third step');
    eq(document.scenarios[1].steps[1].text, 'Fourth step');
  });

  it('should parse specifications in the language defined in the specficiation', () => {
    const text = [
      '#language: Pirate',
      '',
      '@skip',
      'Tale: Some feature',
      '',
      'Pieces of eight',
      '',
      '   @timeout=1000',
      '   Lore: A long time ago',
      '      Giveth first background step',
      '      Background steps can still be free form',
      '',
      '   @browser = Firefox',
      '   Adventure: First scenario',
      '      Giveth first step',
      '      Whence second step',
      '',
      '   Sortie: Second scenario',
      '      Thence third step',
      '      And fourth step',
      '',
      '   Sortie: Third scenario',
      '      Steps can still be free form',
    ].join(os.EOL);

    const document = new SpecificationParser().parse(text);

    eq(document.description, 'Pieces of eight');
    eq(document.annotations[0].name, 'skip');
    eq(document.annotations[0].value, true);
    eq(document.title, 'Some feature');
    eq(document.background.annotations[0].name, 'timeout');
    eq(document.background.annotations[0].value, '1000');
    eq(document.background.title, 'A long time ago');
    eq(document.background.steps[0].text, 'Giveth first background step');
    eq(document.background.steps[0].generalised, 'first background step');
    eq(document.background.steps[1].text, 'Background steps can still be free form');
    eq(document.background.steps[1].generalised, 'Background steps can still be free form');
    eq(document.scenarios[0].annotations[0].name, 'browser');
    eq(document.scenarios[0].annotations[0].value, 'Firefox');
    eq(document.scenarios[0].title, 'First scenario');
    eq(document.scenarios[0].steps[0].text, 'Giveth first step');
    eq(document.scenarios[0].steps[1].text, 'Whence second step');
    eq(document.scenarios[1].title, 'Second scenario');
    eq(document.scenarios[1].steps[0].text, 'Thence third step');
    eq(document.scenarios[1].steps[1].text, 'And fourth step');
    eq(document.scenarios[2].title, 'Third scenario');
    eq(document.scenarios[2].steps[0].text, 'Steps can still be free form');
  });

  it('should report missing languages', () => {
    const text = ['#language: Missing', 'Feature: Some feature'].join(os.EOL);

    throws(() => new SpecificationParser().parse(text), { message: 'Language: Missing was not found' });
  });

  it('should parse specifications in the specified language', () => {
    const text = [
      '@skip',
      'Tale: Some feature',
      '',
      'Pieces of eight',
      '',
      '   @timeout=1000',
      '   Lore: A long time ago',
      '      Giveth first background step',
      '',
      '   @browser = Firefox',
      '   Adventure: First scenario',
      '      Giveth first step',
      '      Whence second step',
      '',
      '   Sortie: Second scenario',
      '      Thence third step',
      '      And fourth step',
    ].join(os.EOL);

    const language = new Languages.Pirate();
    const document = new SpecificationParser().parse(text, { language });

    eq(document.description, 'Pieces of eight');
    eq(document.annotations[0].name, 'skip');
    eq(document.annotations[0].value, true);
    eq(document.title, 'Some feature');
    eq(document.background.annotations[0].name, 'timeout');
    eq(document.background.annotations[0].value, '1000');
    eq(document.background.title, 'A long time ago');
    eq(document.background.steps[0].text, 'Giveth first background step');
    eq(document.background.steps[0].generalised, 'first background step');
    eq(document.scenarios[0].annotations[0].name, 'browser');
    eq(document.scenarios[0].annotations[0].value, 'Firefox');
    eq(document.scenarios[0].title, 'First scenario');
    eq(document.scenarios[0].steps[0].text, 'Giveth first step');
    eq(document.scenarios[0].steps[1].text, 'Whence second step');
    eq(document.scenarios[1].title, 'Second scenario');
    eq(document.scenarios[1].steps[0].text, 'Thence third step');
    eq(document.scenarios[1].steps[1].text, 'And fourth step');
  });

  it('should be multi use', () => {
    const text1 = [
      '@skip',
      'Feature: Some feature',
      '',
      'Some free form text',
      '',
      '   @timeout=1000',
      '   Background: The background',
      '      First background step',
      '',
      '   @browser = Firefox',
      '   Scenario: First scenario',
      '      First step',
      '      Second step',
      '',
      '   Scenario: Second scenario',
      '      Third step',
      '      Fourth step',
    ].join(os.EOL);
    const text2 = text1.replace('Some feature', 'Another feature');

    const result1 = new SpecificationParser().parse(text1);
    const result2 = new SpecificationParser().parse(text2);

    eq(result1.title, 'Some feature');
    eq(result2.title, 'Another feature');
  });

  it('should support DocStrings', () => {
    const text = [
      '@skip',
      'Feature: Some feature',
      '',
      'Some free form text',
      '',
      '   @timeout=1000',
      '   Background: The background',
      '      First background step',
      '         ---',
      '         DocString 1',
      '            DocString 2',
      '         DocString 3   ',
      '         ---',
      '      Second background step',
      '',
      '   @browser = Firefox',
      '   Scenario: First scenario',
      '      First step',
      '         """',
      '         DocString 1',
      '            DocString 2',
      '         DocString 3   ',
      '         """',
      '     Second step',
    ].join(os.EOL);

    const document = new SpecificationParser().parse(text);

    eq(document.background.steps.length, 2);
    eq(document.background.steps[0].text, 'First background step');
    eq(document.background.steps[0].docString, ['DocString 1', '   DocString 2', 'DocString 3   '].join(os.EOL));
    eq(document.background.steps[1].text, 'Second background step');

    eq(document.scenarios.length, 1);
    eq(document.scenarios[0].steps.length, 2);
    eq(document.scenarios[0].steps[0].text, 'First step');
    eq(document.scenarios[0].steps[0].docString, ['DocString 1', '   DocString 2', 'DocString 3   '].join(os.EOL));
    eq(document.scenarios[0].steps[1].text, 'Second step');
  });

  it('should not allow multiple DocStrings in background steps', () => {
    const text = [
      '@skip',
      'Feature: Some feature',
      '',
      '   Background: The background',
      '      First background step',
      '         ---',
      '         DocString 1',
      '            DocString 2',
      '         DocString 3   ',
      '         ---',
      '         ---',
      '         Should error',
      '         ---',
      '      Second background step',
      '',
      '   Scenario: First scenario',
      '     First step',
    ].join(os.EOL);

    throws(() => new SpecificationParser().parse(text), { message: "'         ---' was unexpected in state: AfterBackgroundStepDocStringState on line 11'" });
  });

  it('should not allow multiple DocStrings in scenario steps', () => {
    const text = ['@skip', 'Feature: Some feature', '', '   Scenario: First scenario', '      First step', '         ---', '         DocString 1', '            DocString 2', '         DocString 3   ', '         ---', '         ---', '         Should error', '         ---', '     Second step'].join(
      os.EOL,
    );

    throws(() => new SpecificationParser().parse(text), { message: "'         ---' was unexpected in state: AfterScenarioStepDocStringState on line 11'" });
  });

  it('should support indented DocStrings', () => {
    const text = [
      '@skip',
      'Feature: Some feature',
      '',
      'Some free form text',
      '',
      '   @timeout=1000',
      '   Background: The background',
      '      First background step',
      '',
      '         DocString 1',
      '            DocString 2',
      '         DocString 3   ',
      '      Second background step',
      '',
      '   @browser = Firefox',
      '   Scenario: First scenario',
      '      First step',
      '',
      '         DocString 1',
      '            DocString 2',
      '         DocString 3   ',
      '     Second step',
    ].join(os.EOL);

    const document = new SpecificationParser().parse(text);

    eq(document.background.steps.length, 2);
    eq(document.background.steps[0].text, 'First background step');
    eq(document.background.steps[0].docString, ['DocString 1', '   DocString 2', 'DocString 3   '].join(os.EOL));
    eq(document.background.steps[1].text, 'Second background step');

    eq(document.scenarios.length, 1);
    eq(document.scenarios[0].steps.length, 2);
    eq(document.scenarios[0].steps[0].text, 'First step');
    eq(document.scenarios[0].steps[0].docString, ['DocString 1', '   DocString 2', 'DocString 3   '].join(os.EOL));
    eq(document.scenarios[0].steps[1].text, 'Second step');
  });

  it('should not parse steps that are in DocStrings', () => {
    const text = [
      '@skip',
      'Feature: Some feature',
      '',
      'Some free form text',
      '',
      '   @timeout=1000',
      '   Background: The background',
      '      Given a background step',
      '         ---',
      '         Given a DocString',
      '         Given another DocString',
      '                                ',
      '         ---',
      '      Given another background step',
      '',
      '   @browser = Firefox',
      '   Scenario: First scenario',
      '      Given a step',
      '         """',
      '         Given a DocString',
      '         Given another DocString',
      '                                ',
      '         """',
      '     Given another step',
    ].join(os.EOL);

    const language = new Languages.English();
    const document = new SpecificationParser().parse(text, { language });

    eq(document.background.steps.length, 2);
    eq(document.background.steps[0].generalised, 'a background step');
    eq(document.background.steps[0].docString, ['Given a DocString', 'Given another DocString', '                       '].join(os.EOL));
    eq(document.background.steps[1].generalised, 'another background step');

    eq(document.scenarios.length, 1);
    eq(document.scenarios[0].steps.length, 2);
    eq(document.scenarios[0].steps[0].generalised, 'a step');
    eq(document.scenarios[0].steps[0].docString, ['Given a DocString', 'Given another DocString', '                       '].join(os.EOL));
    eq(document.scenarios[0].steps[1].generalised, 'another step');
  });

  describe('Annotations', () => {
    it('should emit simple annotation events', () => {
      const state = new StubState((event) => {
        eq(event.name, 'AnnotationEvent');
        eq(event.source.line, '@skip');
        eq(event.source.number, 1);
        eq(event.data.name, 'skip');
        eq(event.data.value, true);
      });

      const machine = new StateMachine({ state });
      new SpecificationParser().parse('@skip', { machine });

      eq(state.count, 2);
    });

    it('should trim simple annotation names', () => {
      const state = new StubState((event) => {
        eq(event.source.line, '@skip   ');
        eq(event.data.name, 'skip');
      });

      const machine = new StateMachine({ state });
      new SpecificationParser().parse('@skip   ', { machine });

      eq(state.count, 2);
    });

    it('should emit name value annotation events', () => {
      const state = new StubState((event) => {
        eq(event.name, 'AnnotationEvent');
        eq(event.source.line, '@browser=firefox');
        eq(event.source.number, 1);
        eq(event.data.name, 'browser');
        eq(event.data.value, 'firefox');
      });

      const machine = new StateMachine({ state });
      new SpecificationParser().parse('@browser=firefox', { machine });

      eq(state.count, 2);
    });

    it('should trim name value annotations', () => {
      const state = new StubState((event) => {
        eq(event.source.line, ' @browser = firefox ');
        eq(event.data.name, 'browser');
        eq(event.data.value, 'firefox');
      });

      const machine = new StateMachine({ state });
      new SpecificationParser().parse(' @browser = firefox ', { machine });

      eq(state.count, 2);
    });
  });

  describe('Features', () => {
    it('should emit feature events', () => {
      const state = new StubState((event) => {
        eq(event.name, 'FeatureEvent');
        eq(event.source.line, 'Feature: Some feature');
        eq(event.source.number, 1);
        eq(event.data.title, 'Some feature');
      });

      const machine = new StateMachine({ state });
      new SpecificationParser().parse('Feature: Some feature', { machine });

      eq(state.count, 2);
    });

    it('should trim feature titles', () => {
      const state = new StubState((event) => {
        eq(event.source.line, 'Feature:   Some feature   ');
        eq(event.data.title, 'Some feature');
      });

      const machine = new StateMachine({ state });
      new SpecificationParser().parse('Feature:   Some feature   ', { machine });

      eq(state.count, 2);
    });

    it('should localise feature keyword', () => {
      const state = new StubState((event) => {
        eq(event.source.line, 'Feature:   Some feature   ');
        eq(event.data.title, 'Some feature');
      });

      const machine = new StateMachine({ state });
      new SpecificationParser().parse('Feature:   Some feature   ', { machine });

      eq(state.count, 2);
    });
  });

  describe('Scenarios', () => {
    it('should emit scenario events', () => {
      const state = new StubState((event) => {
        eq(event.name, 'ScenarioEvent');
        eq(event.source.line, 'Scenario: Some scenario');
        eq(event.source.number, 1);
        eq(event.data.title, 'Some scenario');
      });

      const machine = new StateMachine({ state });
      new SpecificationParser().parse('Scenario: Some scenario', { machine });

      eq(state.count, 2);
    });

    it('should trim scenario titles', () => {
      const state = new StubState((event) => {
        eq(event.source.line, 'Scenario:   Some scenario   ');
        eq(event.data.title, 'Some scenario');
      });

      const machine = new StateMachine({ state });
      new SpecificationParser().parse('Scenario:   Some scenario   ', { machine });

      eq(state.count, 2);
    });
  });

  describe('Backgrounds', () => {
    it('should emit background events', () => {
      const state = new StubState((event) => {
        eq(event.name, 'BackgroundEvent');
        eq(event.source.line, 'Background: Some background');
        eq(event.source.number, 1);
        eq(event.data.title, 'Some background');
      });

      const machine = new StateMachine({ state });
      new SpecificationParser().parse('Background: Some background', { machine });

      eq(state.count, 2);
    });

    it('should trim background titles', () => {
      const state = new StubState((event) => {
        eq(event.source.line, 'Background:   Some background   ');
        eq(event.data.title, 'Some background');
      });

      const machine = new StateMachine({ state });
      new SpecificationParser().parse('Background:   Some background   ', { machine });

      eq(state.count, 2);
    });
  });

  describe('Blank lines', () => {
    it('should emit blank line events (1)', () => {
      const state = new StubState((event) => {
        eq(event.name, 'BlankLineEvent');
        eq(event.source.line, '');
        eq(event.source.number, 1);
      });

      const machine = new StateMachine({ state });
      new SpecificationParser().parse('', { machine });

      eq(state.count, 2);
    });

    it('should emit blank line events (2)', () => {
      const state = new StubState((event) => {
        eq(event.name, 'BlankLineEvent');
        eq(event.source.line, '  ');
        eq(event.source.number, 1);
      });

      const machine = new StateMachine({ state });
      new SpecificationParser().parse('  ', { machine });

      eq(state.count, 2);
    });
  });

  describe('Step', () => {
    it('should emit step events when matching localised steps', () => {
      const state = new StubState((event) => {
        eq(event.name, 'StepEvent');
        eq(event.source.line, 'Given some step');
        eq(event.source.number, 1);
        eq(event.data.text, 'Given some step');
        eq(event.data.generalised, 'some step');
      });

      const machine = new StateMachine({ state });
      const language = new Languages.English();
      new SpecificationParser().parse('Given some step', { machine, language });

      eq(state.count, 2);
    });

    it('should trim localised steps', () => {
      const state = new StubState((event) => {
        eq(event.data.text, 'Given some step');
        eq(event.data.generalised, 'some step');
      });

      const machine = new StateMachine({ state });
      const language = new Languages.English();
      new SpecificationParser().parse('   Given some step  ', { machine, language });

      eq(state.count, 2);
    });

    it('should emit step events when matching unlocalised text', () => {
      const state = new StubState((event) => {
        eq(event.name, 'StepEvent');
        eq(event.source.line, 'Some step');
        eq(event.source.number, 1);
        eq(event.data.text, 'Some step');
        eq(event.data.generalised, 'Some step');
      });

      const machine = new StateMachine({ state });
      new SpecificationParser().parse('Some step', { machine });

      eq(state.count, 2);
    });

    it('should trim unlocalised steps', () => {
      const state = new StubState((event) => {
        eq(event.data.text, 'Some step');
        eq(event.data.generalised, 'Some step');
      });

      const machine = new StateMachine({ state });
      new SpecificationParser().parse('   Some step  ', { machine });

      eq(state.count, 2);
    });
  });

  describe('Text', () => {
    it('should trim text', () => {
      const state = new StubState((event) => {
        eq(event.data.text, 'Some text');
      });

      const machine = new StateMachine({ state });
      new SpecificationParser().parse('   Some text  ', { machine });

      eq(state.count, 2);
    });
  });

  describe('Single line comments', () => {
    it('should emit single line comment events', () => {
      const state = new StubState((event) => {
        eq(event.name, 'SingleLineCommentEvent');
        eq(event.source.line, '#Some comment');
        eq(event.source.number, 1);
        eq(event.data.text, 'Some comment');
      });

      const machine = new StateMachine({ state });
      new SpecificationParser().parse('#Some comment', { machine });

      eq(state.count, 2);
    });

    it('should trim single line comments', () => {
      const state = new StubState((event) => {
        eq(event.name, 'SingleLineCommentEvent');
        eq(event.source.line, '  #   Some comment   ');
        eq(event.data.text, 'Some comment');
      });

      const machine = new StateMachine({ state });
      new SpecificationParser().parse('  #   Some comment   ', { machine });

      eq(state.count, 2);
    });
  });

  describe('Multi line comments', () => {
    it('should emit multi line comment events', () => {
      const state = new StubState((event) => {
        eq(event.name, 'MultiLineCommentEvent');
        eq(event.source.line, '###Some comment');
        eq(event.data.text, 'Some comment');
      });

      const machine = new StateMachine({ state });
      new SpecificationParser().parse('###Some comment', { machine });

      eq(state.count, 2);
    });

    it('should trim multi line comments', () => {
      const state = new StubState((event) => {
        eq(event.source.line, '  ####   Some comment   ');
        eq(event.data.text, 'Some comment');
      });

      const machine = new StateMachine({ state });
      new SpecificationParser().parse('  ####   Some comment   ', { machine });

      eq(state.count, 2);
    });
  });
});
