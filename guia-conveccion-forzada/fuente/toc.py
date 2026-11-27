import sys, json
from pypdf import PdfReader
r = PdfReader(sys.argv[1])
titles = {'s1': 'Ideas clave', 's2': 'Mapa de decisión', 's3': 'Método paso a paso', 's4': 'Formulario: convección externa',
          's5': 'Formulario: convección interna', 's6': 'Tus ejercicios de clase', 's7': 'Ejemplos extra',
          's9': 'Errores típicos', 's10': 'Tablas de propiedades', 's11': 'Hoja resumen'}
found = {}
def walk(items):
    for it in items:
        if isinstance(it, list):
            walk(it); continue
        try:
            pg = r.get_destination_page_number(it) + 1
        except Exception:
            continue
        t = it.title.strip()
        for k, v in titles.items():
            if t.startswith(v) and k not in found:
                found[k] = pg
walk(r.outline)
print(len(r.pages), 'pages;', found)
missing = [k for k in titles if k not in found]
if missing: print('MISSING', missing)
json.dump(found, open('pages.json', 'w'))
