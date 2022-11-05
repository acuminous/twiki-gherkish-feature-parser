import BaseLanguage from './BaseLanguage.js';

export default new BaseLanguage({
  name: 'French',
  code: 'fr',
  keywords: {
    feature: ['fonctionnalité'],
    background: ['contexte'],
    scenario: ['scénario'],
    examples: ['exemples', 'exemple', 'ouù'],
  },
});
