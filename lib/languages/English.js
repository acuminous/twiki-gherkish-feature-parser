import BaseLanguage from './BaseLanguage.js';

export default new BaseLanguage({
  name: 'English',
  keywords: {
    feature: ['feature'],
    background: ['background'],
    rule: ['rule'],
    scenario: ['scenario'],
    examples: ['examples', 'where'],
  },
});
