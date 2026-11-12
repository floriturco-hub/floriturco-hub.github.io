#!/usr/bin/env python3
"""Sube a Google Drive los videos de Frecuencia Cero (sustituye a Make).

Para cada nombre recibido sube ohm-video/<nombre>.mp4 y, si existe,
ohm-video/drive/<nombre>.txt a la subcarpeta FrecuenciaCero/<nombre>
(la crea si no existe; si el archivo ya estaba, lo reemplaza).

Autenticación OAuth del propio usuario (una cuenta de servicio no tiene
cuota en "Mi unidad"). Variables de entorno (secretos de GitHub):
  GDRIVE_CLIENT_ID, GDRIVE_CLIENT_SECRET, GDRIVE_REFRESH_TOKEN
  GDRIVE_FOLDER_ID (opcional; por defecto la carpeta FrecuenciaCero)
Uso: python scripts/subir_drive.py cobre-verde [otro-video ...]
"""
import json, os, sys, urllib.parse, urllib.request, uuid

CARPETA = os.environ.get("GDRIVE_FOLDER_ID") or "1GQM8y3XHjGsG35J5BAyWlHWJF4J3lYM4"
API = "https://www.googleapis.com/drive/v3/files"
SUBIDA = "https://www.googleapis.com/upload/drive/v3/files"


def peticion(url, metodo="GET", datos=None, cabeceras=None, token=None):
    cab = dict(cabeceras or {})
    if token:
        cab["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(url, data=datos, method=metodo, headers=cab)
    with urllib.request.urlopen(req) as r:
        cuerpo = r.read()
        return json.loads(cuerpo) if cuerpo else {}


def token_acceso():
    datos = urllib.parse.urlencode({
        "client_id": os.environ["GDRIVE_CLIENT_ID"],
        "client_secret": os.environ["GDRIVE_CLIENT_SECRET"],
        "refresh_token": os.environ["GDRIVE_REFRESH_TOKEN"],
        "grant_type": "refresh_token",
    }).encode()
    return peticion("https://oauth2.googleapis.com/token", "POST", datos,
                    {"Content-Type": "application/x-www-form-urlencoded"})["access_token"]


def buscar(token, nombre, padre, carpeta=False):
    q = f"name = '{nombre}' and '{padre}' in parents and trashed = false"
    if carpeta:
        q += " and mimeType = 'application/vnd.google-apps.folder'"
    url = API + "?" + urllib.parse.urlencode({"q": q, "fields": "files(id,name)"})
    return peticion(url, token=token).get("files", [])


def subcarpeta(token, nombre):
    hay = buscar(token, nombre, CARPETA, carpeta=True)
    if hay:
        return hay[0]["id"]
    meta = json.dumps({"name": nombre, "mimeType": "application/vnd.google-apps.folder",
                       "parents": [CARPETA]}).encode()
    return peticion(API, "POST", meta, {"Content-Type": "application/json"}, token)["id"]


def subir(token, ruta, padre, tipo):
    nombre = os.path.basename(ruta)
    for viejo in buscar(token, nombre, padre):
        peticion(f"{API}/{viejo['id']}", "DELETE", token=token)
    # subida reanudable: sirve para archivos grandes
    meta = json.dumps({"name": nombre, "parents": [padre]}).encode()
    req = urllib.request.Request(f"{SUBIDA}?uploadType=resumable", data=meta, method="POST",
                                 headers={"Authorization": f"Bearer {token}",
                                          "Content-Type": "application/json; charset=UTF-8",
                                          "X-Upload-Content-Type": tipo})
    with urllib.request.urlopen(req) as r:
        destino = r.headers["Location"]
    with open(ruta, "rb") as f:
        datos = f.read()
    res = peticion(destino, "PUT", datos, {"Content-Type": tipo, "Content-Length": str(len(datos))})
    print(f"  subido {nombre} ({len(datos)} bytes) -> {res.get('id')}")


def main(nombres):
    token = token_acceso()
    for n in nombres:
        mp4 = f"ohm-video/{n}.mp4"
        if not os.path.exists(mp4):
            print(f"[{n}] no existe {mp4}, se omite")
            continue
        print(f"[{n}]")
        padre = subcarpeta(token, n)
        txt = f"ohm-video/drive/{n}.txt"
        if os.path.exists(txt):
            subir(token, txt, padre, "text/plain")
        else:
            print(f"  aviso: falta {txt} (título y descripción)")
        subir(token, mp4, padre, "video/mp4")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    main(sys.argv[1:])
