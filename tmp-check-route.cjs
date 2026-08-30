const fs = require('fs');
const { transform } = require('@tanstack/router-generator/dist/cjs/transform/transform.cjs');
const source = fs.readFileSync('src/routes/role-dashboard.tsx', 'utf8');
const res = transform({
  ctx: { routeId: '/role-dashboard', target: 'react', lazy: false },
  source,
  filename: 'src/routes/role-dashboard.tsx',
  node: {},
});
console.log(JSON.stringify(res, null, 2));
