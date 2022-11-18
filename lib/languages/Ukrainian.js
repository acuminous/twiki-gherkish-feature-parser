import BaseLanguage from './BaseLanguage.js';

export default new BaseLanguage({
  name: 'Ukrainian',
  code: 'ua',
  keywords: {
    feature: ['функція', 'функціонал', 'потреба', 'аспект', 'особливість', 'властивість'],
    background: ['контекст'],
    rule: [],
    scenario: ['cценарій', 'шаблон'],
    examples: ['приклади'],
  },
});
