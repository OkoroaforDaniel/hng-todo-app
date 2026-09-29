"""
Database setup.

Everything about *where* the data lives and *how* we connect to it is in this
file, so the rest of the app never has to think about connections.
"""

import os
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

# The SQLite file lives next to this file: backend/todos.db
# You can point it somewhere else with the TODO_DB_PATH environment variable.
DB_PATH = Path(os.getenv("TODO_DB_PATH", Path(__file__).resolve().parent / "todos.db"))

engine = create_engine(
    f"sqlite:///{DB_PATH}",
    # FastAPI handles requests on several threads and SQLite, by default,
    # refuses to share a connection between threads.
    connect_args={"check_same_thread": False},
)

# Each request opens its own session from this factory.
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


class Base(DeclarativeBase):
    """Every database model in models.py inherits from this."""


def get_db():
    """FastAPI dependency: give a session to the request, close it afterwards."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
