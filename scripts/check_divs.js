const fs = require('fs');
const s = fs.readFileSync('src/routes/role-dashboard.tsx', 'utf8');
const lines = s.split('\n');
let balance = 0;
for (let i = 0; i < lines.length; i++) {
  const ln = lines[i];
  const opens = (ln.match(new RegExp('<div[\\s>]', 'g')) || []).length;
  const closes = (ln.match(new RegExp('<\\/div>', 'g')) || []).length;
  balance += opens - closes;
  if (i > 600 && i < 900) {
    if (opens || closes)
      console.log(
        i + 1,
        'opens',
        opens,
        'closes',
        closes,
        'balance',
        balance,
        '|',
        ln.trim().slice(0, 120)
      );
  }
}
console.log('final balance', balance);
