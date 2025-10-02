from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import models, schemas
from .database import SessionLocal, engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get('/api/todos', response_model=list[schemas.Todo])
def list_todos(db: Session = Depends(get_db)):
    return db.query(models.Todo).order_by(models.Todo.id.desc()).all()


@app.post('/api/todos', response_model=schemas.Todo)
def create_todo(todo: schemas.TodoCreate, db: Session = Depends(get_db)):
    db_todo = models.Todo(title=todo.title, description=todo.description, completed=False)
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo


@app.put('/api/todos/{todo_id}', response_model=schemas.Todo)
def update_todo(todo_id: int, todo: schemas.TodoUpdate, db: Session = Depends(get_db)):
    db_todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if not db_todo:
        raise HTTPException(status_code=404, detail='Todo not found')
    if todo.title is not None:
        db_todo.title = todo.title
    if todo.description is not None:
        db_todo.description = todo.description
    if todo.completed is not None:
        db_todo.completed = todo.completed
    db.commit()
    db.refresh(db_todo)
    return db_todo


@app.delete('/api/todos/{todo_id}')
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    db_todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if not db_todo:
        raise HTTPException(status_code=404, detail='Todo not found')
    db.delete(db_todo)
    db.commit()
    return {"ok": True}


@app.post('/api/clear_completed')
def clear_completed(db: Session = Depends(get_db)):
    db.query(models.Todo).filter(models.Todo.completed == True).delete()
    db.commit()
    return {"ok": True}


@app.post('/api/clear_all')
def clear_all(db: Session = Depends(get_db)):
    db.query(models.Todo).delete()
    db.commit()
    return {"ok": True}


@app.get('/health')
def health():
    return {"status": "ok"}
