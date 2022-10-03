import Debug from 'debug';
import BaseLanguage from './BaseLanguage.js';

export default new BaseLanguage({
  name: 'None',
  vocabulary: {
    step: [],
    feature: ['feature'],
    scenario: ['scenario'],
    background: ['background'],
  },
  debug: Debug('yadda:languages:None'),
});
