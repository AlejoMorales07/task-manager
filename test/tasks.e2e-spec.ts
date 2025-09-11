import { AppModule } from '@/app.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DataSource } from 'typeorm'

describe('Tasks e2e', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile()
    app = moduleRef.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
    await app.init()
  })

  afterAll(async () => {
    const dataSource = app.get(DataSource)
    await dataSource.query('TRUNCATE TABLE tasks RESTART IDENTITY CASCADE')
    await dataSource.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE')
    await dataSource.destroy()
    await app.close()
  })

  it('POST /tasks creates a task', async () => {
    const userRes = await request(app.getHttpServer()).post('/users').send({ email: 'taskuser@e2e.com', name: 'Task User' })
    const res = await request(app.getHttpServer()).post('/tasks').send({ title: 'Tarea e2e', userId: userRes.body.id })
    expect(res.status).toBeGreaterThanOrEqual(200)
    expect(res.status).toBeLessThan(400)
    expect(res.body).toHaveProperty('id')
  })

  it('POST /tasks fails with non-existent userId', async () => {
    const res = await request(app.getHttpServer()).post('/tasks').send({ title: 'Tarea e2e', userId: '00000000-0000-0000-0000-000000000000' })
    expect(res.status).toBe(404)
  })

  it('POST /tasks fails without title', async () => {
    const userRes = await request(app.getHttpServer()).post('/users').send({ email: 'taskuser2@e2e.com', name: 'Task User 2' })
    const res = await request(app.getHttpServer()).post('/tasks').send({ userId: userRes.body.id })
    expect(res.status).toBe(400)
  })

  it('GET /tasks/user/:userId return empty array if no tasks', async () => {
    const emptyUserRes = await request(app.getHttpServer()).post('/users').send({ email: 'emptyuser@e2e.com', name: 'Empty User' })
    const res = await request(app.getHttpServer()).get(`/tasks/user/${emptyUserRes.body.id}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.data.length).toBe(0)
  })

  it('GET /tasks/user/:userId lists tasks by user', async () => {
    const userRes = await request(app.getHttpServer()).post('/users').send({ email: 'taskuser3@e2e.com', name: 'Task User 3' })
    await request(app.getHttpServer()).post('/tasks').send({ title: 'Tarea e2e', userId: userRes.body.id })
    const res = await request(app.getHttpServer()).get(`/tasks/user/${userRes.body.id}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  it('GET /tasks/user/:userId fails with invalid userId', async () => {
    const res = await request(app.getHttpServer()).get(`/tasks/user/invalid-id`)
    expect(res.status).toBe(400)
  })

  it('GET /tasks/user/:userId fails with invalid pagination', async () => {
    const userRes = await request(app.getHttpServer()).post('/users').send({ email: 'taskuser4@e2e.com', name: 'Task User 4' })
    const res = await request(app.getHttpServer()).get(`/tasks/user/${userRes.body.id}?page=0&limit=0`)
    expect(res.status).toBe(400)
  })

  it('GET /tasks/user/:userId fails with non-existent user', async () => {
    const res = await request(app.getHttpServer()).get(`/tasks/user/00000000-0000-0000-0000-000000000000`)
    expect(res.status).toBe(404)
  })

  it('PATCH /tasks/:id updates status', async () => {
    const userRes = await request(app.getHttpServer()).post('/users').send({ email: 'taskuser5@e2e.com', name: 'Task User 5' })
    const taskRes = await request(app.getHttpServer()).post('/tasks').send({ title: 'Tarea e2e', userId: userRes.body.id })
    const res = await request(app.getHttpServer()).patch(`/tasks/${taskRes.body.id}`).send({ status: 'DONE' })
    expect(res.status).toBeGreaterThanOrEqual(200)
    expect(res.status).toBeLessThan(400)
    expect(res.body).toHaveProperty('status', 'DONE')
  })

  it('PATCH /tasks/:id fails with invalid status', async () => {
    const userRes = await request(app.getHttpServer()).post('/users').send({ email: 'taskuser6@e2e.com', name: 'Task User 6' })
    const taskRes = await request(app.getHttpServer()).post('/tasks').send({ title: 'Tarea e2e', userId: userRes.body.id })
    const res = await request(app.getHttpServer()).patch(`/tasks/${taskRes.body.id}`).send({ status: 'INVALID_STATUS' })
    expect(res.status).toBe(400)
  })

  it('PATCH /tasks/:id fails with non-existent task', async () => {
    const res = await request(app.getHttpServer()).patch('/tasks/00000000-0000-0000-0000-000000000000').send({ status: 'DONE' })
    expect(res.status).toBe(404)
  })

  it('DELETE /tasks/:id deletes the task', async () => {
    const userRes = await request(app.getHttpServer()).post('/users').send({ email: 'taskuser7@e2e.com', name: 'Task User 7' })
    const taskRes = await request(app.getHttpServer()).post('/tasks').send({ title: 'Tarea e2e', userId: userRes.body.id })
    const res = await request(app.getHttpServer()).delete(`/tasks/${taskRes.body.id}`)
    expect(res.status).toBeGreaterThanOrEqual(200)
    expect(res.status).toBeLessThan(400)
    expect(res.body).toHaveProperty('success', true)
  })

  it('DELETE /tasks/:id fails with invalid id', async () => {
    const res = await request(app.getHttpServer()).delete('/tasks/invalid-id')
    expect(res.status).toBe(400)
  })

  it('DELETE /tasks/:id fails with non-existent task', async () => {
    const res = await request(app.getHttpServer()).delete('/tasks/00000000-0000-0000-0000-000000000000')
    expect(res.status).toBe(404)
  })
})
