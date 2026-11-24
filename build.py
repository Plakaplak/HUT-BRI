#!/usr/bin/env python3
"""Merakit src/ dan assets/ menjadi satu berkas index.html yang mandiri.

Pemakaian:  python3 build.py
Hanya butuh Python 3 (tanpa paket tambahan).
"""
import base64
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent
SRC, ASSETS = ROOT / 'src', ROOT / 'assets'


def data_uri(name, mime):
    raw = (ASSETS / name).read_bytes()
    return f'url("data:{mime};base64,' + base64.b64encode(raw).decode() + '")'


# gambar merek disisipkan sebagai variabel CSS (data URI) agar berkas tetap satu
VARS = {
    '--i-131w': ('logo131-white.svg', 'image/svg+xml'),
    '--i-briB': ('bri-blue.svg', 'image/svg+xml'),
    '--i-briW': ('bri-white.svg', 'image/svg+xml'),
    '--i-daD': ('danantara-dark.svg', 'image/svg+xml'),
    '--i-daW': ('danantara-white.svg', 'image/svg+xml'),
    '--i-art3': ('kv-art3.webp', 'image/webp'),
    '--i-art4': ('kv-art4.webp', 'image/webp'),
    '--i-kvt': ('kv3-text.svg', 'image/svg+xml'),
}

css = ':root{' + ';'.join(f'{k}:{data_uri(*v)}' for k, v in VARS.items()) + '}\n' + (SRC / 'style.css').read_text()
icons = json.loads((SRC / 'icons.json').read_text())
js_files = sorted((SRC / 'js').glob('*.js'))
js = 'const ICONS = ' + json.dumps(icons) + ';\n' + '\n'.join(f.read_text() for f in js_files)

html = f'''<!DOCTYPE html>
<html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>HUT BRI 131: Prototipe Microsite dan Sistem</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>{css}</style></head><body><div id="app"></div><script>{js}</script></body></html>'''

(ROOT / 'index.html').write_text(html)
print(f'index.html dibuat ({len(html) // 1024} KB) dari {len(js_files)} berkas JS')
