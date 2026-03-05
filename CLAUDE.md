# Claude Code Configuration - RuFlo V3

## Behavioral Rules (Always Enforced)

- Do what has been asked; nothing more, nothing less
- NEVER create files unless they're absolutely necessary for achieving your goal
- ALWAYS prefer editing an existing file to creating a new one
- NEVER proactively create documentation files (*.md) or README files unless explicitly requested
- NEVER save working files, text/mds, or tests to the root folder
- Never continuously check status after spawning a swarm — wait for results
- ALWAYS read a file before editing it
- NEVER commit secrets, credentials, or .env files

## File Organization

- NEVER save to root folder — use the directories below
- Use `/src` for source code files
- Use `/tests` for test files
- Use `/docs` for documentation and markdown files
- Use `/config` for configuration files
- Use `/scripts` for utility scripts
- Use `/examples` for example code

## Project Architecture

- Follow Domain-Driven Design with bounded contexts
- Keep files under 500 lines
- Use typed interfaces for all public APIs
- Prefer TDD London School (mock-first) for new code
- Use event sourcing for state changes
- Ensure input validation at system boundaries

### Project Config

- **Topology**: hierarchical-mesh
- **Max Agents**: 15
- **Memory**: hybrid
- **HNSW**: Enabled
- **Neural**: Enabled

## Build & Test

```bash
# Build
npm run build

# Test
npm test

# Lint
npm run lint
```

- ALWAYS run tests after making code changes
- ALWAYS verify build succeeds before committing

## Security Rules

- NEVER hardcode API keys, secrets, or credentials in source files
- NEVER commit .env files or any file containing secrets
- Always validate user input at system boundaries
- Always sanitize file paths to prevent directory traversal
- Run `npx @claude-flow/cli@latest security scan` after security-related changes

## Concurrency: 1 MESSAGE = ALL RELATED OPERATIONS

- All operations MUST be concurrent/parallel in a single message
- Use Claude Code's Task tool for spawning agents, not just MCP
- ALWAYS batch ALL todos in ONE TodoWrite call (5-10+ minimum)
- ALWAYS spawn ALL agents in ONE message with full instructions via Task tool
- ALWAYS batch ALL file reads/writes/edits in ONE message
- ALWAYS batch ALL Bash commands in ONE message

## Swarm Orchestration

- MUST initialize the swarm using CLI tools when starting complex tasks
- MUST spawn concurrent agents using Claude Code's Task tool
- Never use CLI tools alone for execution — Task tool agents do the actual work
- MUST call CLI tools AND Task tool in ONE message for complex work

### 3-Tier Model Routing (ADR-026)

| Tier | Handler | Latency | Cost | Use Cases |
|------|---------|---------|------|-----------|
| **1** | Agent Booster (WASM) | <1ms | $0 | Simple transforms (var→const, add types) — Skip LLM |
| **2** | Haiku | ~500ms | $0.0002 | Simple tasks, low complexity (<30%) |
| **3** | Sonnet/Opus | 2-5s | $0.003-0.015 | Complex reasoning, architecture, security (>30%) |

- Always check for `[AGENT_BOOSTER_AVAILABLE]` or `[TASK_MODEL_RECOMMENDATION]` before spawning agents
- Use Edit tool directly when `[AGENT_BOOSTER_AVAILABLE]`

## Swarm Configuration & Anti-Drift

- ALWAYS use hierarchical topology for coding swarms
- Keep maxAgents at 6-8 for tight coordination
- Use specialized strategy for clear role boundaries
- Use `raft` consensus for hive-mind (leader maintains authoritative state)
- Run frequent checkpoints via `post-task` hooks
- Keep shared memory namespace for all agents

```bash
npx @claude-flow/cli@latest swarm init --topology hierarchical --max-agents 8 --strategy specialized
```

## Swarm Execution Rules

- ALWAYS use `run_in_background: true` for all agent Task calls
- ALWAYS put ALL agent Task calls in ONE message for parallel execution
- After spawning, STOP — do NOT add more tool calls or check status
- Never poll TaskOutput or check swarm status — trust agents to return
- When agent results arrive, review ALL results before proceeding

## V3 CLI Commands

### Core Commands

| Command | Subcommands | Description |
|---------|-------------|-------------|
| `init` | 4 | Project initialization |
| `agent` | 8 | Agent lifecycle management |
| `swarm` | 6 | Multi-agent swarm coordination |
| `memory` | 11 | AgentDB memory with HNSW search |
| `task` | 6 | Task creation and lifecycle |
| `session` | 7 | Session state management |
| `hooks` | 17 | Self-learning hooks + 12 workers |
| `hive-mind` | 6 | Byzantine fault-tolerant consensus |

### Quick CLI Examples

```bash
npx @claude-flow/cli@latest init --wizard
npx @claude-flow/cli@latest agent spawn -t coder --name my-coder
npx @claude-flow/cli@latest swarm init --v3-mode
npx @claude-flow/cli@latest memory search --query "authentication patterns"
npx @claude-flow/cli@latest doctor --fix
```

## Available Agents (60+ Types)

### Core Development
`coder`, `reviewer`, `tester`, `planner`, `researcher`

### Specialized
`security-architect`, `security-auditor`, `memory-specialist`, `performance-engineer`

### Swarm Coordination
`hierarchical-coordinator`, `mesh-coordinator`, `adaptive-coordinator`

### GitHub & Repository
`pr-manager`, `code-review-swarm`, `issue-tracker`, `release-manager`

### SPARC Methodology
`sparc-coord`, `sparc-coder`, `specification`, `pseudocode`, `architecture`

## Memory Commands Reference

```bash
# Store (REQUIRED: --key, --value; OPTIONAL: --namespace, --ttl, --tags)
npx @claude-flow/cli@latest memory store --key "pattern-auth" --value "JWT with refresh" --namespace patterns

# Search (REQUIRED: --query; OPTIONAL: --namespace, --limit, --threshold)
npx @claude-flow/cli@latest memory search --query "authentication patterns"

# List (OPTIONAL: --namespace, --limit)
npx @claude-flow/cli@latest memory list --namespace patterns --limit 10

# Retrieve (REQUIRED: --key; OPTIONAL: --namespace)
npx @claude-flow/cli@latest memory retrieve --key "pattern-auth" --namespace patterns
```

## Quick Setup

```bash
claude mcp add claude-flow -- npx -y @claude-flow/cli@latest
npx @claude-flow/cli@latest daemon start
npx @claude-flow/cli@latest doctor --fix
```

## Claude Code vs CLI Tools

- Claude Code's Task tool handles ALL execution: agents, file ops, code generation, git
- CLI tools handle coordination via Bash: swarm init, memory, hooks, routing
- NEVER use CLI tools as a substitute for Task tool agents

## Support

- Documentation: https://github.com/ruvnet/claude-flow
- Issues: https://github.com/ruvnet/claude-flow/issues


# ApplyMate — Project Guidelines

## Overview
ApplyMate is an AI-powered job application tracker built with React, Node.js/Express, PostgreSQL, and Groq API (Llama 3.3). It features JWT auth, a dashboard with stats, AI resume matching, cover letter generation, and follow-up email writing.

## Tech Stack
- **Frontend:** React, React Router, Axios
- **Backend:** Node.js, Express.js, PostgreSQL
- **AI:** Groq API (Llama 3.3 70B)
- **Auth:** JWT, bcryptjs

## Project Structure
```
backend/
  server.js
  config/db.js
  middleware/auth.js
  middleware/validate.js
  routes/auth.js
  routes/applications.js
  routes/ai.js
  controllers/authController.js
  controllers/applicationController.js
  controllers/aiController.js
  services/groqService.js
  utils/errorHandler.js
frontend/
  src/
    pages/
    components/
    hooks/
    context/
    utils/
database/
  schema.sql
```

## Coding Rules
- Use `const` over `let`; never use `var`
- Always use async/await, never raw promises
- All API routes must have input validation (Joi)
- All DB queries must use parameterized queries ($1, $2) — never string concatenation
- Frontend components use functional components + hooks only
- Keep components under 150 lines; extract logic into custom hooks
- All API calls go through the Axios interceptor (not raw axios)
- Never commit .env files or API keys
- Never commit .DS_Store files

## Current Optimization Priorities

### HIGH (Do First)
1. Add database indexes: `user_id`, `status`, `created_at`, composite `(user_id, status)` on applications table
2. Refactor monolithic `server.js` into modular routes/controllers/services architecture
3. Add Joi input validation on all POST/PUT routes
4. Add `express-rate-limit` on `/api/ai` endpoints (30 req / 15 min)
5. Create Axios interceptor for automatic JWT token attachment + 401 redirect

### MEDIUM (Do Next)
6. Add `React.lazy` code splitting for Dashboard and AI tool pages
7. Replace all `alert()` with `react-hot-toast` notifications
8. Add loading skeletons and error boundary states to all data-fetching components
9. Add `node-cache` caching middleware on dashboard stats routes (5 min TTL)
10. Improve AI prompts to return structured JSON (especially resume matcher)

### LOW (Do Later)
11. Add Kanban board view for application pipeline (drag between status columns)
12. Add Recharts pie/line charts to dashboard
13. Implement dark mode with CSS custom properties
14. Add company logo auto-fetch via Clearbit API
15. Add CI/CD with GitHub Actions

## AI Prompt Guidelines
- Resume Matcher must return valid JSON with: match_score, matching_keywords, missing_keywords, section_scores, suggestions, ats_tips
- Cover Letter must be 3-4 paragraphs, under 400 words, no generic openers
- Follow-up Email must include days-since-applied context, under 150 words
- All AI calls must use retry logic with exponential backoff (max 3 retries)
- All AI JSON responses must be validated before sending to frontend

## Security Rules
- Use helmet for HTTP headers
- CORS must have explicit allowed origins (no wildcard `*`)
- JWT access tokens expire in 15 minutes; use refresh tokens
- bcrypt salt rounds: minimum 12
- Never expose stack traces in production error responses

## Testing
- Test all API endpoints with valid and invalid inputs
- Test JWT auth flow: register, login, protected route, expired token
- Test AI endpoints with empty inputs and malformed data

## Commands
- Backend: `npm run dev` (from root)
- Frontend: `cd frontend && npm start`
- Database: `psql -U postgres -d applymate -f database/schema.sql`
