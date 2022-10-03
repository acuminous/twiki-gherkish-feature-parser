import Debug from 'debug';
import BaseLanguage from './BaseLanguage.js';

export default new BaseLanguage({
  name: 'English',
  code: 'en',
  vocabulary: {
    step: ['given', 'with', 'when', 'if', 'then', 'and', 'but', 'except'],
    feature: ['feature'],
    scenario: ['scenario'],
    background: ['background'],
  },
  debug: Debug('yadda:languages:English'),
});
