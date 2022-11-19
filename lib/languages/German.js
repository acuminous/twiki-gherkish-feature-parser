import BaseLanguage from './BaseLanguage.js';

export default new BaseLanguage({
  name: 'German',
  keywords: {
    feature: ['feature', 'funktionalität', 'aspekt', 'usecase', 'anwendungsfall'],
    background: ['grundlage', 'hintergrund'],
    rule: [],
    scenario: ['szenario'],
    examples: ['beispiele'],
  },
});
