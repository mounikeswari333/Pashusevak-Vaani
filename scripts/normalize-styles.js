const fs = require('fs');
const p = 'src/routes/index.tsx';
let s = fs.readFileSync(p, 'utf8');
let orig = s;
// Replace backtick-wrapped expressions carefully
s = s.replace(/`([^`]*)`/g, (m, inner) => {
  const trimmed = inner.trim();
  // if the inner is just a quoted hex like "#fff" or #fff, keep as quoted string
  if (/^"?\s*#([0-9a-fA-F]{3,8})\s*"?$/.test(trimmed)) {
    const hex = trimmed.replace(/"/g, '').trim();
    return '"' + hex + '"';
  }
  // otherwise, remove inner quotes around hex tokens inside the string
  const cleaned = trimmed
    .replace(/"\s*#([0-9a-fA-F]{3,8})\s*"/g, '#$1')
    .replace(/"#([0-9a-fA-F]{3,8})"/g, '#$1');
  return '"' + cleaned + '"';
});
// Also fix cases where a double-quoted string contains quoted hex (after previous ops)
s = s.replace(/"([^"\n]*?)"/g, (m, inner) => {
  // if entire string is just a hex without other chars, keep quotes
  if (/^#([0-9a-fA-F]{3,8})$/.test(inner.trim())) return '"' + inner + '"';
  // otherwise remove any internal quoted-hex remnants
  const cleaned = inner.replace(/"\s*#([0-9a-fA-F]{3,8})\s*"/g, '#$1');
  return '"' + cleaned + '"';
});
if (s !== orig) {
  fs.writeFileSync(p, s, 'utf8');
  console.log('Patched', p);
} else {
  console.log('No change', p);
}
