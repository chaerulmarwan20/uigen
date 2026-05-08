# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# First-time setup (install deps, generate Prisma client, run migrations)
npm run setup

# Development server (Turbopack)
npm run dev

# Development server writing logs to file (background-friendly)
npm run dev:daemon

# Build
npm run build

# Lint
npm run lint

# Run all tests
npm test

# Run a single test file
npx vitest run src/lib/__tests__/file-system.test.ts

# Reset the database
npm run db:reset
```

**Do not run `npm audit fix`.** Dependencies are pinned to specific versions; audit fix can break the app.

## Environment

Copy `.env` and set `ANTHROPIC_API_KEY`. Without a real key (or if the placeholder `your-api-key-here` is left), the app uses a `MockLanguageModel` that returns canned components — the full UI still works but AI generation is simulated. Set `JWT_SECRET` for production; a fallback development secret is used automatically.

## Architecture

UIGen is a Next.js 15 (App Router) application where users describe React components in a chat interface and the AI generates them with a live preview — no files are written to disk.

### Request / AI pipeline

1. The browser sends chat messages + the current virtual file system state to `POST /api/chat` ([src/app/api/chat/route.ts](src/app/api/chat/route.ts)).
2. The route calls `getLanguageModel()` ([src/lib/provider.ts](src/lib/provider.ts)) which returns either `anthropic("claude-haiku-4-5")` or a `MockLanguageModel`.
3. `streamText` (Vercel AI SDK) runs with two tools: `str_replace_editor` and `file_manager` (in [src/lib/tools/](src/lib/tools/)). These tools operate on a server-side `VirtualFileSystem` instance reconstructed from the request body.
4. The AI streams tool calls back. The client (`ChatContext`) intercepts each tool call via `onToolCall` and applies it to the client-side `FileSystemContext`.
5. On completion, if the user is authenticated and a `projectId` is provided, the updated messages and file system are persisted to SQLite via Prisma.

### Virtual file system

`VirtualFileSystem` ([src/lib/file-system.ts](src/lib/file-system.ts)) is an in-memory tree of `FileNode` objects. It exists in two places simultaneously:

- **Server**: reconstructed per-request from serialized JSON sent by the client.
- **Client**: maintained in `FileSystemContext` ([src/lib/contexts/file-system-context.tsx](src/lib/contexts/file-system-context.tsx)) as React state, updated by AI tool calls.

Serialization uses plain objects (no `Map`); deserialization via `deserializeFromNodes` restores the tree structure.

### Live preview

`PreviewFrame` ([src/components/preview/PreviewFrame.tsx](src/components/preview/PreviewFrame.tsx)) renders an `<iframe>` whose `srcdoc` is regenerated whenever `refreshTrigger` changes. `createImportMap` / `createPreviewHTML` in [src/lib/transform/jsx-transformer.ts](src/lib/transform/jsx-transformer.ts) use `@babel/standalone` to transpile JSX/TSX in the browser and build an ES module import map — no bundler is invoked. The entry point is resolved in priority order: `/App.jsx`, `/App.tsx`, `/index.jsx`, `/index.tsx`, `/src/App.jsx`, `/src/App.tsx`.

### Authentication

JWT-based sessions stored in an `httpOnly` cookie (`auth-token`). Core helpers are in [src/lib/auth.ts](src/lib/auth.ts) (server-only). The middleware ([src/middleware.ts](src/middleware.ts)) protects project routes. Anonymous users can generate components; their work is stored in `sessionStorage` via [src/lib/anon-work-tracker.ts](src/lib/anon-work-tracker.ts) and offered for save on sign-up.

### Data persistence

Prisma + SQLite (`prisma/dev.db`). Schema has two models: `User` and `Project`. `Project.messages` and `Project.data` are JSON strings (chat history and serialized VFS respectively). The Prisma client is generated into `src/generated/prisma/`.

### Component map

| Layer          | Key files                                                                             |
| -------------- | ------------------------------------------------------------------------------------- |
| Pages          | `src/app/page.tsx` (home), `src/app/[projectId]/page.tsx` (project)                   |
| Chat           | `src/components/chat/ChatInterface.tsx`, `src/lib/contexts/chat-context.tsx`          |
| Editor         | `src/components/editor/CodeEditor.tsx` (Monaco), `src/components/editor/FileTree.tsx` |
| Preview        | `src/components/preview/PreviewFrame.tsx`                                             |
| Auth UI        | `src/components/auth/`                                                                |
| Server actions | `src/actions/` (create/get projects)                                                  |
| UI primitives  | `src/components/ui/` (shadcn/ui components)                                           |

### Testing

Tests use Vitest + jsdom + React Testing Library. Test files live alongside source in `__tests__/` subdirectories. The vitest config ([vitest.config.mts](vitest.config.mts)) resolves TypeScript path aliases via `vite-tsconfig-paths`.
