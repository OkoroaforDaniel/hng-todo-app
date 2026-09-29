"""The database tables, described as Python classes."""

from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class Todo(Base):
    """One todo item = one row in the `todos` table."""

    __tablename__ = "todos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(300), nullable=False)
    completed: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    # `position` is what "move it around" changes: the list is sorted by it.
    position: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    # When the todo was added. The cards show this as a little date pill.
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.now)
