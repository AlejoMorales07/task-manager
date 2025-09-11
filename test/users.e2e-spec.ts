import { AppModule } from '@/app.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { App } from 'supertest/types'
import { DataSource } from 'typeorm'

describe('Users e2e', () => {
  let app: INestApplication<App>

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile()
    app = moduleRef.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
    await app.init()
  })

  afterAll(async () => {
    const dataSource = app.get(DataSource)
    await dataSource.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE')
    await dataSource.destroy()
    await app.close()
  })

  it('POST /users creates a user', async () => {
    const res = await request(app.getHttpServer()).post('/users').send({ email: 'e@e.com', name: 'John' })
    expect(res.status).toBeGreaterThanOrEqual(200)
    expect(res.status).toBeLessThan(400)
  })

  it('POST /users fails with missing name', async () => {
    const res = await request(app.getHttpServer()).post('/users').send({ email: 'e2@e.com' })
    expect(res.status).toBe(400)
  })

  it('POST /users fails with duplicate email', async () => {
    await request(app.getHttpServer()).post('/users').send({ email: 'dup@e.com', name: 'Dup' })
    const res = await request(app.getHttpServer()).post('/users').send({ email: 'dup@e.com', name: 'Dup' })
    expect(res.status).toBe(409)
  })

  it('POST /users fails with invalid email', async () => {
    const res = await request(app.getHttpServer()).post('/users').send({ email: 'not-an-email', name: 'John' })
    expect(res.status).toBe(400)
  })

  it('GET /users/:id returns a user', async () => {
    const userRes = await request(app.getHttpServer()).post('/users').send({ email: 'taskuser1@e2e.com', name: 'Task User' })
    const res = await request(app.getHttpServer()).get(`/users/${userRes.body.id}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('id', userRes.body.id)
  })

  it('GET /users/:id fails with invalid id', async () => {
    const res = await request(app.getHttpServer()).get('/users/not-a-uuid')
    expect(res.status).toBe(400)
  })

  it('GET /users/:id returns 404 for missing user', async () => {
    const res = await request(app.getHttpServer()).get('/users/00000000-0000-0000-0000-000000000000')
    expect(res.status).toBe(404)
  })
})
