import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import os from 'node:os';
import zunit from 'zunit';
import { SpecificationParser, Languages } from '../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('Specification Parser', () => {

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
