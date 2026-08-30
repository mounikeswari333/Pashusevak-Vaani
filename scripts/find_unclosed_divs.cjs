const fs = require('fs');
const s = fs.readFileSync('src/routes/role-dashboard.tsx', 'utf8');
const lines = s.split('\n');
const stack = [];
for (let i = 0; i < lines.length; i++) {
  const ln = lines[i];
  const regex = /<div([\s>])/g;
  let m;
  while ((m = regex.exec(ln)) !== null) {
    stack.push({ line: i + 1, text: ln.trim().slice(0, 120) });
  }
  const closeRegex = new RegExp('<\\/div>', 'g');
  while ((m = closeRegex.exec(ln)) !== null) {
    if (stack.length) stack.pop();
    else console.log('Extra closing at', i + 1, ln.trim());
  }
}
console.log('Unclosed <div> count:', stack.length);
stack.forEach((s) => console.log('Unclosed at line', s.line, s.text));
