# twiki-gherkish-feature-parser

## TL;DR
```js
import { GherkishFeatureParser } from '@twiki-bdd/twiki-gherkish-feature-parser';
import * as fs from 'node:fs';

const file = fs.readFileSync('./buck-rogers-season-one.feature');
const parser = new GherkishFeatureParser();
const feature = parser.parse(specification);
```
