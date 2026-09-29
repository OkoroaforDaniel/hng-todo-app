"""Pydantic schemas: the exact shape of the JSON that goes in and out."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class TodoCreate(BaseModel):
    """Body of POST /api/todos."""

    title: str = Field(min_length=1, max_length=300)


class TodoUpdate(BaseModel):
    """Body of PATCH /api/todos/{id}: send only the fields you want to change."""

    title: str | None = Field(default=None, min_length=1, max_length=300)
    completed: bool | None = None


class TodoOut(BaseModel):
    """What the API sends back to React."""

    # Lets us build this straight from a SQLAlchemy Todo object.
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    completed: bool
    position: int
    # Optional because a database created before this column existed may still
    # hold rows without it (see ensure_schema in main.py).
    created_at: datetime | None = None


class ReorderRequest(BaseModel):
    """The new order, as every todo id from top to bottom."""

    ids: list[int]
