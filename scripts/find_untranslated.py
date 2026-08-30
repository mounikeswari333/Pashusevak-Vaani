from pathlib import Path
import re

base = Path(__file__).resolve().parent.parent
path = base / 'src' / 'routes' / 'index.tsx'
text = path.read_text(encoding='utf-8')
lines = text.splitlines()
string_re = re.compile(r"(['\"])(.*?)(?<!\\)\1")
ignore_line_tokens = [
    'className=', 'style=', 'href=', 'src=', 'alt=', 'id=', 'width=', 'height=', 'name=',
    'content=', 'property=', 'meta', 'path=', 'import ', 'export ', 'const ', 'type ',
    'enum ', 'interface ', 'as ', 'return(', 'return ', '=>', 'placeholder=', 'animation',
    'background', 'rounded', 'transition', 'tracking', 'uppercase', 'line-height', 'lineHeight',
    'font-', 'grid', 'flex', 'px-', 'py-', 'h-', 'w-', 'min-', 'max-', 'fill=', 'stroke=',
    'style={{', 'color:', 'backgroundColor', 'borderColor', 'boxShadow', 'shadow', 'text-', 'gap-'
]

for i, line in enumerate(lines, start=1):
    for m in string_re.finditer(line):
        full = m.group(0)
        val = m.group(2)
        if not val or val.strip() == '':
            continue
        if any(token in line for token in ignore_line_tokens):
            continue
        if val.startswith('#') or val.startswith('http') or val.startswith('data:'):
            continue
        if val in ['true', 'false', 'null', 'undefined']:
            continue
        if re.fullmatch(r'[A-Za-z0-9_\- &\.\/:;\(\)\?\+]+', val) is None:
            continue
        before = line[:m.start()].rstrip()
        if before.endswith('t(') or before.endswith('t(`') or before.endswith('t("') or before.endswith("t('"):
            continue
        if 'className' in line or 'style=' in line or 'href=' in line or 'src=' in line or 'alt=' in line:
            continue
        if 'export default' in line or line.strip().startswith('type ') or line.strip().startswith('const '):
            # allow constant identifiers and type names in definitions
            pass
        print(i, repr(val), line.strip())
