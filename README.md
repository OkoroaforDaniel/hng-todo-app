# Todo List

A small full-stack todo app with a dashboard look, built to be easy to read
from top to bottom.

- **Frontend:** React 19 + Vite (plain JavaScript, no TypeScript)
- **Backend:** FastAPI + SQLAlchemy
- **Database:** SQLite (a single file: `backend/todos.db`)

The design follows the picture in `moodboard/_.jpeg`: a soft grey canvas with
blurred shapes, a floating white panel, a sidebar with a black pill for the
active item, stat cards with big numbers, a progress ring, rounded-square
checkboxes, date pills, a dashed "+ Add task" tile and dark cards for finished
work.

## What you can do

- **Add** a task — the black "Add task" button, or the dashed tile on the board
- **Check it off** — finished tasks get crossed out and move to the dark band
- **Move it around** — drag a card, or use the ⋮ menu → Move up / Move down
- **Rename** it — double-click the title, or ⋮ menu → Rename
- **Delete** it — ⋮ menu → Delete, or "Clear completed" in the sidebar
- **Filter** — All / Active / Completed in the sidebar (with live counts)
- **Search** — the magnifier in the header filters by title as you type
- **Switch layout** — grid or list, from the toggle above the board

Nothing is a mock-up: every number, ring and card is calculated from your real
tasks, and every control does something.

## Folder layout

```
hng/
├── start.sh                    # starts both servers with one command
├── moodboard/_.jpeg            # the design this UI was built from
├── backend/
│   ├── main.py                 # the API endpoints (start here)
│   ├── database.py             # SQLite connection + session handling
│   ├── models.py               # the `todos` table as a Python class
│   ├── schemas.py              # the JSON shapes the API accepts and returns
│   ├── requirements.txt        # Python packages
│   ├── pytest.ini              # test settings
│   ├── tests/test_api.py       # 15 tests for the API
│   └── todos.db                # the database file (created on first run)
└── frontend/
    ├── index.html
    ├── vite.config.js          # dev server settings + /api proxy
    └── src/
        ├── main.jsx            # mounts React onto the page
        ├── App.jsx             # state + all the handlers (start here)
        ├── api.js              # every call to the backend
        ├── index.css           # design tokens + page background
        ├── App.css             # all the component styles
        └── components/
            ├── Icons.jsx           # the inline SVG icon set
            ├── Sidebar.jsx         # logo, filters, hints, clear completed
            ├── Header.jsx          # greeting, add button, search, avatar
            ├── OverviewCard.jsx    # big numbers + the three mini stats
            ├── ProgressCard.jsx    # "% done" ring + clear button
            ├── FocusCard.jsx       # "Up next" checklist
            ├── TodoBoard.jsx       # the grid of cards + drag & drop
            ├── TodoCard.jsx        # one task card
            ├── CardMenu.jsx        # the ⋮ popover
            ├── CompletedSection.jsx # the dark "recently completed" band
            ├── CompletedCard.jsx   # one dark card
            └── AddTodoForm.jsx     # the open "+ Add task" tile
```

## Run it

**One command (does the setup too):**

```bash
./start.sh
```

**Or start the two halves yourself, in two terminals:**

```bash
# Terminal 1 — backend
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

```bash
# Terminal 2 — frontend
cd frontend
npm install
npm run dev
```

Then open **http://127.0.0.1:5174**

> The backend uses port **8001** and the frontend **5174**, because another app
> on this machine is already using 8000 and 5173. You can change them in
> `start.sh` and `frontend/vite.config.js` (keep them the same in both files).

## Where is my data?

Everything is in `backend/todos.db`. Delete that file to start with an empty
list (it is recreated the next time the backend starts).

## The API

Interactive docs (try any endpoint from the browser): http://127.0.0.1:8001/docs

| Method | Path | What it does |
| --- | --- | --- |
| GET | `/api/todos` | every todo, in order |
| POST | `/api/todos` | add one — `{"title": "Buy milk"}` |
| PATCH | `/api/todos/{id}` | change one — `{"completed": true}` and/or `{"title": "..."}` |
| DELETE | `/api/todos/{id}` | remove one |
| PUT | `/api/todos/reorder` | new order — `{"ids": [3, 1, 2]}` (must list every id) |
| GET | `/api/health` | is the backend awake? |

## Configuration (environment variables)

Everything has a sensible default, so you only need these when you deploy:

| Variable | Used by | Default | What it does |
| --- | --- | --- | --- |
| `DATABASE_URL` | backend | `sqlite:///backend/todos.db` | Which database to use. Set it to a hosted Postgres/Turso address when deploying, because most hosts do not keep files between restarts. |
| `TODO_DB_PATH` | backend | `backend/todos.db` | Where the local SQLite file lives (handy for tests). |
| `ALLOWED_ORIGINS` | backend | `*` | Comma separated list of frontend addresses allowed to call the API. |
| `VITE_API_BASE` | frontend | *empty* | The backend's address, when it is not on the same address as the frontend. |

You set these in the hosting dashboard (Vercel/Render) or in front of the
command, for example:

```bash
cd backend
DATABASE_URL="postgresql+psycopg://user:secret@host/todos" uvicorn main:app --port 8001
```

## Run the tests

```bash
cd backend
.venv/bin/pip install -r requirements-dev.txt
.venv/bin/pytest
```

## How it fits together

1. `App.jsx` keeps the list of todos in React state, plus which filter, search
   word, layout and sort order you picked.
2. When you change something, the screen updates immediately (so it feels
   instant) and then `api.js` sends the change to FastAPI.
3. If a request fails, the error appears under the greeting and the list is
   reloaded from the database, so the screen can never silently disagree with
   what is stored.
4. Vite forwards every `/api/...` call to the backend on port 8001
   (`vite.config.js`), which is why the React code never needs a full URL.

## Notes on a few choices

- The sidebar looks like the moodboard's navigation, but instead of decoration
  it holds the three **real** filters, so nothing in the UI is fake.
- The `created_at` column was added so the cards can show a date pill like the
  design. `ensure_schema()` in `main.py` adds it to a database that was created
  before it existed.
- Icons are hand-written inline SVG in `Icons.jsx`, so there is no icon library
  to install or keep up to date.

## Deploy it (Vercel + Render + Neon)

The React half goes on Vercel, the API on Render, and the data in a free Neon
Postgres database. (Vercel cannot host the API with a SQLite file, because its
serverless functions get a read-only filesystem that is thrown away after each
request - the data has to live on the network.)

**1. Database — Neon (neon.tech)**

1. Create a project, then copy the **connection string** - it looks like
   `postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`
2. Paste it where asked below, exactly as it is. The backend rewrites it to use
   the `psycopg` driver for you.

**2. API — Render (render.com)**

1. **New +** → **Blueprint** → pick this repository. Render reads `render.yaml`
   and creates a `todo-api` web service from the `backend` folder.
2. It asks for the two secrets:
   - `DATABASE_URL` → the Neon string from step 1
   - `ALLOWED_ORIGINS` → leave empty for now (you can paste your Vercel address
     here afterwards to lock the API down)
3. When the deploy finishes, `https://<your-service>.onrender.com/api/health`
   should answer `{"status": "ok"}`, and `/docs` gives you the API explorer.

**3. Frontend — Vercel (vercel.com)**

1. **Add New… → Project** → import this repository.
2. Set **Root Directory** to `frontend`; Vercel then detects Vite by itself
   (build `npm run build`, output `dist`).
3. Add an environment variable: `VITE_API_BASE` = your Render address, e.g.
   `https://todo-api-xxxx.onrender.com`
4. Deploy, open the Vercel address, and add a task to prove the two halves are
   talking to each other.

Good to know:

- Render's free tier sleeps after 15 minutes idle, so the first request after a
  break takes ~30 seconds and then it is quick again.
- `backend/todos.db` is only used on your machine. In the cloud everything lives
  in Neon.
- Every `git push` to `main` redeploys both halves automatically.

## Nice things to add later

- Due dates and priorities on the cards
- Undo after deleting (keep the last deleted todo in memory)
- Grouping tasks into projects, like the moodboard's "Last Projects"
- Packaged as one container instead of two dev servers
