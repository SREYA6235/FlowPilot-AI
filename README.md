# FlowPilot AI

Natural-language powered agentic workflow automation demo.

## What it does
- Turns a natural-language task into a structured 3–5 step plan.
- Uses a LangGraph workflow with Planner, Executor, and Reviewer nodes.
- Produces a deliverable and an AI quality assessment.
- Displays workflow steps, execution logs, and an approximate model-cost estimate.

**Safety boundary:** This MVP generates plans and content only. It does not send emails, modify external systems, or execute arbitrary code. The displayed cost is an illustrative estimate based on token usage and a configurable assumed rate, not a billing statement.

## Requirements
- Python 3.10+
- Node.js 18+
- OpenAI API key

## 1. Backend setup
```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```
Put your API key in `backend/.env`, then start:
```bash
uvicorn app.main:app --reload
```
Backend: http://localhost:8000  
API docs: http://localhost:8000/docs

## 2. Frontend setup
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

## 3. Test
Use one of the examples in the UI, or:
```bash
curl -X POST http://localhost:8000/api/run \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Analyze customer feedback and prepare a prioritized action plan."}'
```

## Project structure
```text
flowpilot-ai/
  backend/
    app/
      main.py
      engine.py
      schemas.py
    .env.example
    requirements.txt
  frontend/
    src/
      App.jsx
      main.jsx
      style.css
    index.html
    package.json
    vite.config.js
  README.md
```

## Architecture
React UI -> FastAPI -> LangGraph:
1. Planner creates a structured workflow.
2. Executor generates the requested deliverable.
3. Reviewer scores the output and summarizes issues.
4. API returns the plan, result, score, and logs.

## Important production improvements
- Add authentication and per-user authorization.
- Store runs in PostgreSQL.
- Add retry/timeout policies and structured tracing.
- Use real provider pricing for cost calculations.
- Add explicit tool permissions and human approval before any external side effect.
- Add automated tests and rate limiting.
