# twiki-gherkish-parser

## TL;DR
```js
import { GherkishFeatureParser, English } from 'twiki-gherkish-parser';
import * as fs from 'node:fs';

const file = fs.readFileSync('./buck-rogers-season-one.feature');
const parser = new GherkishFeatureParser({ language: English });
const document = parser.parse(specification);
```