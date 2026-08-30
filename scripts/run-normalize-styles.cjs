const fs = require('fs');
const p = 'pashusevak-digital-vaani/src/routes/index.tsx';
let s = fs.readFileSync(p, 'utf8');
let orig = s;
// Replace backtick-wrapped expressions carefully
s = s.replace(/`([^`]*)`/g, (m, inner) => {
  const trimmed = inner.trim();
  if (/^"?\s*#([0-9a-fA-F]{3,8})\s*"?$/.test(trimmed)) {
    const hex = trimmed.replace(/"/g, '').trim();
    return '"' + hex + '"';
  }
  const cleaned = trimmed
    .replace(/"\s*#([0-9a-fA-F]{3,8})\s*"/g, '#$1')
    .replace(/"#([0-9a-fA-F]{3,8})"/g, '#$1');
  return '"' + cleaned + '"';
});
// Also fix cases where a double-quoted string contains quoted hex (after previous ops)
s = s.replace(/"([^"\n]*?)"/g, (m, inner) => {
  if (/^#([0-9a-fA-F]{3,8})$/.test(inner.trim())) return '"' + inner + '"';
  const cleaned = inner.replace(/"\s*#([0-9a-fA-F]{3,8})\s*"/g, '#$1');
  return '"' + cleaned + '"';
});
if (s !== orig) {
  fs.writeFileSync(p, s, 'utf8');
  console.log('Patched', p);
} else {
  console.log('No change', p);
}
