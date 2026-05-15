// src/types/express.d.ts
// Extends Express's Request type to include req.user everywhere.
// After this, TypeScript knows exactly what's on req.user — no casting needed.

import { Role } from '@prisma/client'

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        email: string
        name: string
        role: Role
      }
    }
  }
}

export {}
