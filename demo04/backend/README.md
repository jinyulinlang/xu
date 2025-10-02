# Backend (FastAPI)

Requirements: Python 3.8+

Install dependencies:

```bash
# use `python3` if `python` is not available on your PATH
python3 -m pip install -r requirements.txt
```

Run the app (development):

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Run tests:

```bash
cd backend
./run_tests.sh
```

Notes:
- Default database is `todos.db` in the backend folder. To use a different database, set `DATABASE_URL` environment variable (e.g. `export DATABASE_URL=postgresql://user:pass@host/db`).

Docker
------

Build and run the backend with Docker:

```bash
# build image
docker build -t todo-backend:latest .

# run container
docker run --rm -p 8000:8000 todo-backend:latest
```

Or use docker-compose from repo root:

```bash
docker-compose up --build
```
