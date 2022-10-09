import BaseLanguage from './BaseLanguage.js';

export default new BaseLanguage({
  name: 'English',
  code: 'en',
  keywords: {
    feature: ['feature'],
    background: ['background'],
    scenario: ['scenario'],
    examples: ['examples', 'where'],
  },
});
