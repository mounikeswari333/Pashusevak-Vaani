const fs = require('fs');
const s = fs.readFileSync('src/routes/role-dashboard.tsx', 'utf8');
const lines = s.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('<input')) {
    let found = false;
    for (let j = i; j < Math.min(lines.length, i + 30); j++) {
      if (lines[j].includes('/>')) {
        found = true;
        break;
      }
    }
    if (!found) console.log('Possible unclosed <input at line', i + 1, lines[i].trim());
  }
}
