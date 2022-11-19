import BaseLanguage from './BaseLanguage.js';

export default new BaseLanguage({
  name: 'French',
  keywords: {
    feature: ['fonctionnalité'],
    background: ['contexte'],
    rule: [],
    scenario: ['scénario'],
    examples: ['exemples', 'exemple', 'ouù'],
  },
});
