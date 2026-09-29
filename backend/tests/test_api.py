"""
Tests for the todo API.

Run them from the backend folder with:
    .venv/bin/pytest
"""

from datetime import datetime

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

import models  # noqa: F401  -- importing it registers the `todos` table
from database import Base, get_db
from main import app


@pytest.fixture()
def client(tmp_path):
    """A TestClient whose database is a throwaway file, so tests never touch todos.db."""
    engine = create_engine(
        f"sqlite:///{tmp_path / 'test.db'}",
        connect_args={"check_same_thread": False},
    )
    TestingSession = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)
    Base.metadata.create_all(bind=engine)

    def override_get_db():
        db = TestingSession()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


def add(client: TestClient, title: str) -> dict:
    """Helper: create a todo and give back the created JSON."""
    response = client.post("/api/todos", json={"title": title})
    assert response.status_code == 201, response.text
    return response.json()


def titles(client: TestClient) -> list[str]:
    """Helper: the titles of the todos, in the order the app would show them."""
    return [todo["title"] for todo in client.get("/api/todos").json()]


def test_health(client: TestClient):
    assert client.get("/api/health").json() == {"status": "ok"}


def test_list_starts_empty(client: TestClient):
    response = client.get("/api/todos")
    assert response.status_code == 200
    assert response.json() == []


def test_create_todo(client: TestClient):
    todo = add(client, "Buy milk")
    assert todo["title"] == "Buy milk"
    assert todo["completed"] is False
    assert todo["position"] == 0
    assert titles(client) == ["Buy milk"]


def test_create_stamps_a_creation_date(client: TestClient):
    todo = add(client, "Buy milk")

    # An ISO-8601 timestamp such as "2026-09-29T02:41:07.123456".
    created_at = datetime.fromisoformat(todo["created_at"])
    assert created_at.year >= 2026


def test_create_trims_whitespace(client: TestClient):
    assert add(client, "  Walk the dog  ")["title"] == "Walk the dog"


def test_create_rejects_blank_title(client: TestClient):
    # Empty string is refused before the endpoint even runs.
    assert client.post("/api/todos", json={"title": ""}).status_code == 422
    # Only-spaces passes the length check but is caught by the endpoint.
    assert client.post("/api/todos", json={"title": "   "}).status_code == 400


def test_new_todos_go_to_the_bottom(client: TestClient):
    add(client, "First")
    add(client, "Second")
    add(client, "Third")

    positions = [todo["position"] for todo in client.get("/api/todos").json()]
    assert positions == [0, 1, 2]
    assert titles(client) == ["First", "Second", "Third"]


def test_check_todo_off(client: TestClient):
    todo = add(client, "Buy milk")

    response = client.patch(f"/api/todos/{todo['id']}", json={"completed": True})
    assert response.status_code == 200
    assert response.json()["completed"] is True

    response = client.patch(f"/api/todos/{todo['id']}", json={"completed": False})
    assert response.json()["completed"] is False


def test_rename_todo(client: TestClient):
    todo = add(client, "Buy milk")

    response = client.patch(f"/api/todos/{todo['id']}", json={"title": "Buy oat milk"})
    assert response.json()["title"] == "Buy oat milk"
    assert client.patch(f"/api/todos/{todo['id']}", json={"title": " "}).status_code == 400


def test_update_missing_todo(client: TestClient):
    assert client.patch("/api/todos/999", json={"completed": True}).status_code == 404


def test_delete_todo_and_renumber(client: TestClient):
    add(client, "First")
    middle = add(client, "Second")
    add(client, "Third")

    response = client.delete(f"/api/todos/{middle['id']}")
    assert response.status_code == 204
    assert response.content == b""

    remaining = client.get("/api/todos").json()
    assert [todo["title"] for todo in remaining] == ["First", "Third"]
    assert [todo["position"] for todo in remaining] == [0, 1]


def test_delete_missing_todo(client: TestClient):
    assert client.delete("/api/todos/999").status_code == 404


def test_reorder(client: TestClient):
    first = add(client, "First")
    second = add(client, "Second")
    third = add(client, "Third")

    # Drag "Third" to the very top.
    response = client.put(
        "/api/todos/reorder",
        json={"ids": [third["id"], first["id"], second["id"]]},
    )

    assert response.status_code == 200
    assert [todo["title"] for todo in response.json()] == ["Third", "First", "Second"]
    assert titles(client) == ["Third", "First", "Second"]
    assert [todo["position"] for todo in response.json()] == [0, 1, 2]


def test_reorder_needs_every_id_once(client: TestClient):
    first = add(client, "First")
    add(client, "Second")

    # A missing id cannot be placed, so this must fail instead of guessing.
    assert client.put("/api/todos/reorder", json={"ids": [first["id"]]}).status_code == 400
    # Repeating an id is just as broken.
    assert (
        client.put(
            "/api/todos/reorder", json={"ids": [first["id"], first["id"]]}
        ).status_code
        == 400
    )


def test_reorder_with_unknown_id(client: TestClient):
    add(client, "First")
    assert client.put("/api/todos/reorder", json={"ids": [999]}).status_code == 400
