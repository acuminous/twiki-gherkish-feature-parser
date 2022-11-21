import fs from 'node:fs';
import path from 'node:path';

const packageJsonUrl = new URL(path.join('..', 'package.json'), import.meta.url);
const packageJson = JSON.parse(fs.readFileSync(packageJsonUrl));

export default {
  name: packageJson.name,
  issues: packageJson.bugs.url,
  pulls: packageJson.bugs.url.replace('issues', 'pulls'),
};
