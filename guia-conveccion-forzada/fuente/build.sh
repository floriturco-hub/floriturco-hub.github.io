#!/bin/bash
set -e
cd "$(dirname "$0")"
rm -f pages.json
python3 gen.py >/dev/null
node render.js guia.html guia.pdf > render1.log
python3 toc.py guia.pdf
python3 gen.py >/dev/null
node render.js guia.html guia.pdf
python3 toc.py guia.pdf
