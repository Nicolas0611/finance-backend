# CLAUDE.md

This file defines the architecture rules, conventions, and patterns for this project.
Follow these strictly when adding or modifying any code.

---

## Stack

- **Runtime**: Node.js
- **Language**: TypeScript (strict mode)
- **Framework**: Express
- **ORM**: Prisma
- **Validation**: Zod
- **Auth**: JWT + bcrypt
- **Testing**: Jest + Supertest

---

## Project structure

```
src/
├── types/
│   ├── express.d.ts       ← extends req.user globally
│   └── index.ts           ← shared types (AuthUser, JwtPayload...)
├── config/
│   ├── app.ts             ← all env vars, never read process.env elsewhere
│   └── database.ts        ← single Prisma instance, never instantiate elsewhere
├── routes/                ← URL mapping + middleware chain only
├── controllers/           ← HTTP handling only, delegate to services
├── services/              ← business logic, no req/res knowledge
├── repositories/          ← all Prisma queries, no logic
├── middlewares/
│   ├── auth.ts            ← authenticate + authorize
│   ├── validate.ts        ← Zod validation factory
│   └── errorHandler.ts    ← global error handler, must be last in app.ts
├── validators/            ← Zod schemas + inferred types
└── utils/
    ├── AppError.ts        ← throw this for all expected HTTP errors
    └── response.ts        ← sendSuccess / sendCreated / sendError
```

---

## Layer rules — the most important section

Each layer has exactly one job. Never mix responsibilities.

### Routes
- Define the URL, the middleware chain, and which controller to call.
- No logic, no imports from services or repositories.
- Always apply `validate(schema)` before the controller for mutating endpoints.
- Always apply `authenticate` before any protected endpoint.

```typescript
// correct
router.post('/', authenticate, validate(createPostSchema), postController.create)

// wrong — logic in the route
router.post('/', authenticate, (req, res) => { ... })
```

### Controllers
- Handle `req` and `res`. That is their entire job.
- Call one service method, send the response, catch errors with `next(err)`.
- No business logic. No direct Prisma calls. No if/else about permissions.
- If you find yourself writing a rule ("only admins can..."), move it to the service.

```typescript
// correct
const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const post = await postService.create(req.body, req.user!.id)
    sendCreated(res, { post })
  } catch (err) {
    next(err)
  }
}

// wrong — business logic in controller
const create = async (req: Request, res: Response, next: NextFunction) => {
  if (req.user!.role !== 'ADMIN') { ... } // belongs in service
}
```

### Services
- Contain all business logic and rules.
- Never import `Request`, `Response`, or anything from Express.
- Never import Prisma directly — always go through a repository.
- Throw `AppError` when a rule is violated.

```typescript
// correct
const remove = async (id: string, requestingUser: AuthUser) => {
  const post = await postRepository.findById(id)
  if (!post) throw new AppError('Post not found', 404)
  if (post.author.id !== requestingUser.id && requestingUser.role !== 'ADMIN')
    throw new AppError('Forbidden', 403)
  return postRepository.remove(id)
}

// wrong — importing Express types
import { Request } from 'express' // never in a service
```

### Repositories
- The only files that import and use Prisma.
- No business logic, no if/else, no permission checks.
- Just queries. Input goes in, data comes out.
- Use `select` to exclude sensitive fields (e.g. password) by default.

```typescript
// correct — pure query
const findById = (id: string) =>
  prisma.post.findUnique({ where: { id }, include: { author: { select: { id: true, name: true } } } })

// wrong — logic in repository
const findById = async (id: string, userId: string) => {
  const post = await prisma.post.findUnique(...)
  if (post?.authorId !== userId) throw new Error(...) // belongs in service
}
```

### Validators
- Define Zod schemas for every request body.
- Always export the inferred TypeScript type alongside the schema.
- Never duplicate types manually — always use `z.infer<typeof schema>`.

```typescript
export const createPostSchema = z.object({ ... })
export type CreatePostInput = z.infer<typeof createPostSchema> // always export this
```

---

## TypeScript rules

- **strict mode is on** — no implicit `any`, no unchecked nulls.
- Never use `any`. Use `unknown` if the type is truly unknown, then narrow it.
- Use `z.infer<>` to derive types from Zod schemas — never write the same shape twice.
- Use `req.user!` (non-null assertion) only inside routes that are behind `authenticate` middleware.
- All Prisma query result types come from `@prisma/client` — never redefine model shapes manually.
- Use `Prisma.PostWhereInput`, `Prisma.PostUpdateInput`, etc. for Prisma input types in repositories.
- `as const` on Prisma `select`/`include` objects to get precise return types.

---

## Error handling

- Always throw `AppError` for expected HTTP errors anywhere in the codebase.
- Never call `res.status(...).json(...)` directly for errors — always `next(err)`.
- The global `errorHandler` middleware in `src/middlewares/errorHandler.ts` handles everything.
- Prisma errors (P2002 duplicate, P2025 not found) are converted to `AppError` automatically in the error handler.

```typescript
// correct
throw new AppError('Email already in use', 409)
throw new AppError('Not found', 404)
throw new AppError('Forbidden', 403)

// wrong
res.status(409).json({ message: 'Email already in use' }) // bypasses error handler
throw new Error('something broke') // no status code, leaks in production
```

---

## Response shape

Every response must use the helpers in `src/utils/response.ts`.
Never call `res.json()` directly.

```typescript
sendSuccess(res, { post })         // 200 { success: true, data: { post } }
sendCreated(res, { post })         // 201 { success: true, data: { post } }
sendError(res, 'message', 400)     // only for edge cases — prefer throwing AppError
```

---

## Authentication & authorisation

- `authenticate` — verifies JWT and attaches `req.user`. Apply to any protected route.
- `authorize(...roles)` — checks `req.user.role`. Must come after `authenticate`.
- Never do role checks in controllers. They belong in services or via `authorize` middleware.
- Never return the `password` field from any query. Use `select` in the repository to exclude it.

---

## Database rules

- Never import `prisma` outside of `src/config/database.ts` and the repository files.
- Never run raw SQL unless absolutely necessary and documented with a comment explaining why.
- Always run `npm run db:generate` after changing `prisma/schema.prisma`.
- Always run `npm run db:migrate` to apply schema changes in development.
- Seed data lives in `prisma/seed.ts` — use `npm run db:seed` to populate dev data.

---

## Adding a new resource — always follow this order

1. Add model to `prisma/schema.prisma`
2. `npm run db:migrate` — creates the table
3. `npm run db:generate` — updates TypeScript types
4. `src/validators/thingValidators.ts` — Zod schema + exported inferred type
5. `src/repositories/thingRepository.ts` — Prisma queries only
6. `src/services/thingService.ts` — business logic, uses repository
7. `src/controllers/thingController.ts` — HTTP handling, uses service
8. `src/routes/thingRoutes.ts` — URL mapping + middleware chain
9. Register the router in `src/app.ts`
10. Add tests in `tests/thing.test.ts`

---

## ESLint rules worth knowing

- `import/no-cycle` — **enforces layer separation**. If you import a controller from a service, ESLint will catch it. This is intentional.
- `@typescript-eslint/no-explicit-any` — warning. Avoid `any`; use proper types.
- `no-return-await` — don't `return await` inside a `try/catch` unless you need it.
- `no-console` — use `console.error` only. For logging, add a proper logger.

Run `npm run lint` before committing. Run `npm run lint:fix` to auto-fix what can be fixed.

---

## Testing

- Tests live in `tests/` and use `.test.ts` extension.
- Use `supertest` to test routes end-to-end — do not unit test controllers in isolation.
- Always clean the database in `beforeEach` to ensure test isolation.
- Always disconnect Prisma in `afterAll`.
- Test the happy path and at least: missing auth (401), wrong permissions (403), not found (404), duplicate (409), and bad input (400).

```typescript
beforeEach(async () => {
  await prisma.comment.deleteMany()
  await prisma.post.deleteMany()
  await prisma.user.deleteMany()
})

afterAll(async () => {
  await prisma.$disconnect()
})
```

---

## Environment variables

- All env vars are read in `src/config/app.ts` — nowhere else.
- Never read `process.env` directly outside of `src/config/app.ts`.
- Document new env vars in `.env.example` immediately.
- Never commit `.env`.