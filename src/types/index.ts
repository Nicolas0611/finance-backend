// src/types/index.ts
// Shared types used across multiple layers.
// Keep types here that don't belong to a single file.

export interface JwtPayload {
  userId: string
}

export interface AuthUser {
  id: string
  email: string
  name: string
  role: 'USER' | 'ADMIN'
}

// Used by response helpers
export interface ApiSuccess<T> {
  success: true
  data: T
}

export interface ApiError {
  success: false
  message: string
  errors?: { field: string; message: string }[]
}
