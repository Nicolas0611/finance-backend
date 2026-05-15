// tests/auth.test.ts
import request from 'supertest'
import app from '../src/app'
import prisma from '../src/config/database'

beforeEach(async () => {
  await prisma.comment.deleteMany()
  await prisma.post.deleteMany()
  await prisma.user.deleteMany()
})

afterAll(async () => {
  await prisma.$disconnect()
})

const validUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
}

describe('POST /api/auth/register', () => {
  it('registers a new user and returns a token', async () => {
    const res = await request(app).post('/api/auth/register').send(validUser)

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.data.token).toBeDefined()
    expect(res.body.data.user.password).toBeUndefined() // never expose password
    expect(res.body.data.user.email).toBe(validUser.email)
  })

  it('returns 409 if email is already taken', async () => {
    await request(app).post('/api/auth/register').send(validUser)
    const res = await request(app).post('/api/auth/register').send(validUser)

    expect(res.status).toBe(409)
    expect(res.body.success).toBe(false)
  })

  it('returns 400 with field errors if email is invalid', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...validUser, email: 'not-an-email' })

    expect(res.status).toBe(400)
    expect(res.body.errors[0].field).toBe('email')
  })

  it('returns 400 if password is too short', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...validUser, password: '123' })

    expect(res.status).toBe(400)
    expect(res.body.errors[0].field).toBe('password')
  })
})

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/register').send(validUser)
  })

  it('logs in with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email, password: validUser.password })

    expect(res.status).toBe(200)
    expect(res.body.data.token).toBeDefined()
  })

  it('returns 401 with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email, password: 'wrongpassword' })

    expect(res.status).toBe(401)
  })
})

describe('GET /api/auth/me', () => {
  it('returns the current user when authenticated', async () => {
    const registerRes = await request(app).post('/api/auth/register').send(validUser)
    const { token } = registerRes.body.data

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.data.user.email).toBe(validUser.email)
  })

  it('returns 401 without a token', async () => {
    const res = await request(app).get('/api/auth/me')
    expect(res.status).toBe(401)
  })
})
