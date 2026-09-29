"""
The FastAPI application: one function per endpoint.

Run it from the backend folder with:
    uvicorn main:app --reload --port 8001

Interactive API docs are then at http://127.0.0.1:8001/docs
"""

import os
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from models import Todo
from schemas import ReorderRequest, TodoCreate, TodoOut, TodoUpdate


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Get the database ready when the server starts."""
    ensure_schema()
    yield


def ensure_schema() -> None:
    """
    Create the tables, and add columns that were introduced later.

    `create_all` only creates *missing tables*, it never changes an existing
    one - so a database made before `created_at` existed needs the ALTER below.
    That fix-up only applies to SQLite; other databases are created correctly.
    """
    Base.metadata.create_all(bind=engine)

    if engine.dialect.name != "sqlite":
        return

    with engine.begin() as connection:
        columns = {
            row[1] for row in connection.exec_driver_sql("PRAGMA table_info(todos)")
        }
        if "created_at" not in columns:
            connection.exec_driver_sql("ALTER TABLE todos ADD COLUMN created_at DATETIME")
        # Rows that predate the column would otherwise show no date at all.
        connection.exec_driver_sql(
            "UPDATE todos SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL"
        )



app = FastAPI(title="Todo List API", version="1.0.0", lifespan=lifespan)

# The React app runs on a different address to the API (another port in
# development, another domain in production), so the browser treats the calls
# as cross-origin. Set ALLOWED_ORIGINS - comma separated - to lock this down.
ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "*").split(",")
    if origin.strip()
] or ["*"]  # an empty setting means "no restriction", not "block everything"

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)


def ordered_todos(db: Session) -> list[Todo]:
    """Every todo, in the order the user sees them."""
    return list(db.scalars(select(Todo).order_by(Todo.position, Todo.id)))


def renumber(db: Session) -> None:
    """Rewrite positions as 0, 1, 2, ... while keeping the current order."""
    for index, todo in enumerate(ordered_todos(db)):
        todo.position = index


@app.get("/")
def root() -> dict[str, str]:
    """A friendly landing page so the API root isn't a 404."""
    return {
        "message": "Todo List API",
        "docs": "/docs",
        "todos": "/api/todos",
    }


@app.get("/api/health")
def health() -> dict[str, str]:
    """Used to check that the backend is up."""
    return {"status": "ok"}


@app.get("/api/todos", response_model=list[TodoOut])
def list_todos(db: Session = Depends(get_db)):
    return ordered_todos(db)


@app.post("/api/todos", response_model=TodoOut, status_code=status.HTTP_201_CREATED)
def create_todo(payload: TodoCreate, db: Session = Depends(get_db)):
    title = payload.title.strip()
    if not title:
        raise HTTPException(status_code=400, detail="A todo needs a title.")

    last_position = db.scalar(select(func.max(Todo.position)))
    todo = Todo(
        title=title,
        completed=False,
        position=0 if last_position is None else last_position + 1,
    )
    db.add(todo)
    db.commit()
    db.refresh(todo)
    return todo


@app.patch("/api/todos/{todo_id}", response_model=TodoOut)
def update_todo(todo_id: int, payload: TodoUpdate, db: Session = Depends(get_db)):
    """Used for checking a todo off, and for renaming it."""
    todo = db.get(Todo, todo_id)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found.")

    if payload.title is not None:
        title = payload.title.strip()
        if not title:
            raise HTTPException(status_code=400, detail="A todo needs a title.")
        todo.title = title

    if payload.completed is not None:
        todo.completed = payload.completed

    db.commit()
    db.refresh(todo)
    return todo


@app.delete("/api/todos/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = db.get(Todo, todo_id)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found.")

    db.delete(todo)
    db.commit()
    renumber(db)  # keep positions tidy: 0, 1, 2, ...
    db.commit()


@app.put("/api/todos/reorder", response_model=list[TodoOut])
def reorder_todos(payload: ReorderRequest, db: Session = Depends(get_db)):
    """Called after a drag & drop: `ids` is the whole list, in the new order."""
    todos = db.scalars(select(Todo)).all()
    by_id = {todo.id: todo for todo in todos}

    if len(payload.ids) != len(set(payload.ids)):
        raise HTTPException(status_code=400, detail="The same todo id appears twice.")

    if set(payload.ids) != set(by_id):
        raise HTTPException(
            status_code=400,
            detail="The reorder list must contain every todo id exactly once.",
        )

    for index, todo_id in enumerate(payload.ids):
        by_id[todo_id].position = index

    db.commit()
    return ordered_todos(db)
