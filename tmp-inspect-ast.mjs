import fs from 'node:fs';
import { parseAst } from './node_modules/@tanstack/router-utils/dist/esm/ast.js';
const source = fs.readFileSync('src/routes/role-dashboard.tsx', 'utf8');
const ast = parseAst({ code: source, filename: 'src/routes/role-dashboard.tsx' });
console.log(ast.program.body.map((node) => node.type));
for (const node of ast.program.body) {
  if (node.type === 'ExportNamedDeclaration') {
    console.log(
      'EXPORT',
      node.declaration?.type,
      node.declaration?.declarations?.map((d) => d.id?.name)
    );
  }
}
