import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import os from 'node:os';
import zunit from 'zunit';
import { SpecificationParser, Languages } from '../lib/index.js';

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

    const document = new SpecificationParser().parse(text, { language: Languages.Pirate });

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

    const document = new SpecificationParser().parse(text, { language: Languages.English });

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
});
