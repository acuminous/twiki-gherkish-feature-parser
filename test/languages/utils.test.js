import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import { Languages } from '../../lib/index.js';

const { describe, it, xdescribe, xit, before, beforeEach, after, afterEach } = zunit;
const { BaseLanguage, utils } = Languages;

class Esperanto extends BaseLanguage {
  constructor({ name }) {
    super({
      name,
      vocabulary: {
        step: [],
        feature: [],
        scenario: [],
        background: [],
      },
    });
  }
}

describe('utils', () => {
  afterEach(() => {
    utils.setDefault('none');
  });

  it('should set the default to no language', () => {
    eq(utils.getDefault().name, 'None');
  });

  it('should set the default language', () => {
    utils.setDefault('English');
    eq(utils.getDefault().name, 'English');
  });

  it('should find a language by name', () => {
    eq(utils.find('english').name, 'English');
  });

  it('should find a language by code', () => {
    eq(utils.find('en').name, 'English');
  });

  it('should tolerate missing languages when finding', () => {
    eq(utils.find('missing'), undefined);
  });

  it('should get a language by name', () => {
    eq(utils.get('english').name, 'English');
  });

  it('should get a language by code', () => {
    eq(utils.get('en').name, 'English');
  });

  it('should not tolerate missing languages when getting', () => {
    throws(() => utils.get('missing'), { message: 'Language: missing was not found' });
  });

  it('should add a new language', () => {
    utils.add(new Esperanto({ name: 'Arnold' }));
    eq(utils.find('Arnold').name, 'Arnold');
    eq(utils.getDefault().name, 'Arnold');
  });

  it('should add a new language without making it default', () => {
    utils.add(new Esperanto({ name: 'Rimmer' }), false);
    eq(utils.find('Rimmer').name, 'Rimmer');
    eq(utils.getDefault().name, 'None');
  });
});
