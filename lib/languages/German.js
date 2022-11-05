import BaseLanguage from './BaseLanguage.js';

export default new BaseLanguage({
  name: 'German',
  code: 'de',
  keywords: {
    feature: ['feature', 'funktionalität', 'aspekt', 'usecase', 'anwendungsfall'],
    background: ['grundlage', 'hintergrund'],
    scenario: ['szenario'],
    examples: ['beispiele'],
  },
});
