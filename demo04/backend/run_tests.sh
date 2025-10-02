#!/usr/bin/env bash
set -euo pipefail

# Install dev deps (optional)
python3 -m pip install -r requirements.txt

# Run pytest
pytest -q
