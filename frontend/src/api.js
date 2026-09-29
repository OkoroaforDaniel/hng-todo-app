/**
 * Every call to the FastAPI backend lives in this file.
 *
 * The paths start with "/api" and Vite forwards them to the backend for us
 * (see vite.config.js), so there is no server address to keep in sync here.
 */

async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    // FastAPI puts the reason in {"detail": "..."} - show that when we can.
    let message = `Something went wrong (${response.status}).`;
    try {
      const body = await response.json();
      if (typeof body.detail === "string") message = body.detail;
    } catch {
      // No JSON in the response: keep the generic message.
    }
    throw new Error(message);
  }

  // A 204 No Content reply (delete) has no body to read.
  return response.status === 204 ? null : response.json();
}

/** All todos, already in the right order. */
export function getTodos() {
  return request("/api/todos");
}

/** Add a todo to the bottom of the list. */
export function createTodo(title) {
  return request("/api/todos", {
    method: "POST",
    body: JSON.stringify({ title }),
  });
}

/** Change one todo: pass { completed: true } or { title: "new text" }. */
export function updateTodo(id, changes) {
  return request(`/api/todos/${id}`, {
    method: "PATCH",
    body: JSON.stringify(changes),
  });
}

export function deleteTodo(id) {
  return request(`/api/todos/${id}`, { method: "DELETE" });
}

/** Save a new order. `ids` must list every todo id, top to bottom. */
export function reorderTodos(ids) {
  return request("/api/todos/reorder", {
    method: "PUT",
    body: JSON.stringify({ ids }),
  });
}
