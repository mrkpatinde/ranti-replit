---
name: Ranti-landing workflow config
description: Correct PORT and BASE_PATH for the ranti-landing artifact dev workflow.
---

The artifact assigns PORT=20724 and BASE_PATH=/ (defined in `artifacts/ranti-landing/.replit-artifact/artifact.toml`).

`configureWorkflow` does NOT inject artifact env vars automatically — they must be passed explicitly in the command string.

**Correct workflow command:**
```
PORT=20724 BASE_PATH=/ pnpm --filter @workspace/ranti-landing run dev
```

**Why:** The vite.config.ts throws if PORT or BASE_PATH are missing. The default Vite port (5173) conflicts with the artifact-assigned port and breaks the preview routing.

**How to apply:** Any time the ranti-landing dev workflow is created or reconfigured, use the command above with `waitForPort: 20724`.
