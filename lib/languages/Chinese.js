import BaseLanguage from './BaseLanguage.js';

export default new BaseLanguage({
  name: 'Chinese',
  code: 'cn',
  keywords: {
    feature: ['功能'],
    background: ['背景', '前提'],
    rule: [],
    scenario: ['场景'],
    examples: ['例子', '示例', '举例', '样例'],
  },
});
