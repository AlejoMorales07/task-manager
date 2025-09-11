import { Test } from '@nestjs/testing'
import { TasksController } from './tasks.controller'
import { TasksService } from '@/task/application/tasks.service'
import { TaskStatus } from '@/task/domain/task.entity'

describe('TasksController', () => {
  let controller: TasksController
  const tasksServiceMock = {
    listByUser: jest.fn(async () => []),
    create: jest.fn(async (dto: any) => ({ id: 't1', ...dto })),
    updateStatus: jest.fn(async (id: string, status: TaskStatus) => ({ id, status })),
    softDelete: jest.fn(async (id: string) => ({ success: true }))
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [{ provide: TasksService, useValue: tasksServiceMock }]
    }).compile()

    controller = moduleRef.get(TasksController)
    jest.clearAllMocks()
  })

  it('lists tasks by user', async () => {
    const res = await controller.listByUser('u1', TaskStatus.PENDING, '1', '10')
    expect(tasksServiceMock.listByUser).toHaveBeenCalledWith('u1', { status: TaskStatus.PENDING }, { page: 1, limit: 10 })
    expect(Array.isArray(res)).toBe(true)
  })

  it('creates a task', async () => {
    const payload = { title: 'A', userId: 'u1' }
    const res = await controller.create(payload as any)
    expect(tasksServiceMock.create).toHaveBeenCalledWith(payload)
    expect(res).toHaveProperty('id')
  })

  it('updates status', async () => {
    const res = await controller.updateStatus('t1', { status: TaskStatus.DONE } as any)
    expect(tasksServiceMock.updateStatus).toHaveBeenCalledWith('t1', TaskStatus.DONE)
    expect(res).toEqual({ id: 't1', status: TaskStatus.DONE })
  })

  it('removes a task', async () => {
    const res = await controller.remove('t1')
    expect(tasksServiceMock.softDelete).toHaveBeenCalledWith('t1')
    expect(res).toEqual({ success: true })
  })
})
