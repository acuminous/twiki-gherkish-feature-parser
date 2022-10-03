import Debug from 'debug';
import BaseLanguage from './BaseLanguage.js';

export default new BaseLanguage({
  name: 'English',
  code: 'en',
  keywords: {
    feature: ['feature'],
    background: ['background'],
    scenario: ['scenario'],
  },
  debug: Debug('twiki-bdd:gherkish-feature-parser:languages:English'),
});
