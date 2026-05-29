# QR Studio

A small Flask app for generating QR codes as PNG images.

## Setup

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

Open `http://127.0.0.1:5000` in your browser.

## Deploy

Use this start command on a Python hosting service:

```bash
gunicorn app:app
```
