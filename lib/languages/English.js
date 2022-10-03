import Debug from 'debug';
import BaseLanguage from './BaseLanguage.js';

export default new BaseLanguage({
  name: 'English',
  code: 'en',
  vocabulary: {
    feature: ['feature'],
    scenario: ['scenario'],
    background: ['background'],
  },
  debug: Debug('yadda:languages:English'),
});
