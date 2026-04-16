from pathlib import Path

replacements = [
    ('from backend.database import', 'from database import'),
    ('from backend.models import', 'from models import'),
    ('from backend.services.', 'from services.'),
    ('from backend import models, schemas', 'import models, schemas'),
    ('from backend import models', 'import models'),
    ('from backend import schemas', 'import schemas'),
]

for path in Path('.').rglob('*.py'):
    text = path.read_text(encoding='utf-8')
    new_text = text
    for old, new in replacements:
        new_text = new_text.replace(old, new)
    if new_text != text:
        path.write_text(new_text, encoding='utf-8')
        print('updated', path)
