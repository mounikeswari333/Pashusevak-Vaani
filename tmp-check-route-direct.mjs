import fs from 'node:fs';
import { transform } from './node_modules/@tanstack/router-generator/dist/esm/transform/transform.js';
const source = fs.readFileSync('src/routes/role-dashboard.tsx', 'utf8');
const res = transform({
  ctx: { routeId: '/role-dashboard', target: 'react', lazy: false },
  source,
  filename: 'src/routes/role-dashboard.tsx',
  node: {},
});
console.log(JSON.stringify(res, null, 2));
