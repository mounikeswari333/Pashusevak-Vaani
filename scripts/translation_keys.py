from pathlib import Path
import re

base = Path(__file__).resolve().parent.parent
index = base / 'src' / 'routes' / 'index.tsx'
hi = base / 'src' / 'locales' / 'hi.ts'
text = index.read_text(encoding='utf-8')
keys = sorted(set(re.findall(r"t\(\s*['\"](.*?)['\"]\s*\)", text)))
print('KEYS')
for k in keys:
    print(k)
print('---')
hi_text = hi.read_text(encoding='utf-8')
missing = [k for k in keys if k not in hi_text]
print('MISSING')
for k in missing:
    print(k)
