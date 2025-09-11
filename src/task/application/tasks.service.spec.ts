import { TaskStatus } from '@/task/domain/task.entity'
import { TaskRepository } from '@/task/domain/task.repository'
import { UserRepository } from '@/user/domain/user.repository'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { TasksService } from './tasks.service'

describe('TasksService', () => {
  let service: TasksService
  let taskRepo: {
    create: jest.Mock
    findByUser: jest.Mock
    updateStatus: jest.Mock
    softDelete: jest.Mock
    findById: jest.Mock
  }
  let userRepo: { findById: jest.Mock }
  const validUserId = 'a3b1c2d3-4e5f-4789-abcd-ef0123456789'
  const validTaskId = 'b4c2d3e4-5f60-478a-bcde-f1234567890a'
  const notFoundUserId = 'e7f8a9b0-1234-4abc-8def-567890abcdef'

  beforeEach(async () => {
    taskRepo = {
      create: jest.fn(async (data: any) => ({ id: validTaskId, ...data })),
      findByUser: jest.fn(async (userId: string) => (userId === validUserId ? [] : [])),
      updateStatus: jest.fn(async (id: string, status: TaskStatus) => ({ id, status })),
      softDelete: jest.fn(async () => undefined),
      findById: jest.fn(async (id: string) => (id === validTaskId ? { id, status: TaskStatus.PENDING } : null))
    }

    userRepo = {
      findById: jest.fn(async (id: string) => {
        if (id === validUserId) return { id }
        if (id === notFoundUserId) return null
        return null
      })
    }

    const moduleRef = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useValue: taskRepo as unknown as TaskRepository },
        { provide: UserRepository, useValue: userRepo as unknown as UserRepository }
      ]
    }).compile()

    service = moduleRef.get(TasksService)
  })

  it('creates a task for existing user', async () => {
    const result = await service.create({ title: 'A', userId: validUserId })
    expect(userRepo.findById).toHaveBeenCalledWith(validUserId)
    expect(taskRepo.create).toHaveBeenCalled()
    expect(result).toHaveProperty('id')
  })

  it('throws BadRequestException for invalid userId', async () => {
    await expect(service.create({ title: 'A', userId: 'not-a-uuid' })).rejects.toBeInstanceOf(BadRequestException)
    await expect(service.create({ title: 'A', userId: '12345678-1234-1234-1234-1234567890' })).rejects.toBeInstanceOf(BadRequestException)
  })

  it('throws NotFoundException when user does not exist', async () => {
    await expect(service.create({ title: 'A', userId: notFoundUserId })).rejects.toBeInstanceOf(NotFoundException)
  })

  it('lists tasks by user with validation', async () => {
    await expect(service.listByUser('not-a-uuid')).rejects.toBeInstanceOf(BadRequestException)
    await expect(service.listByUser('12345678-1234-1234-1234-1234567890')).rejects.toBeInstanceOf(BadRequestException)
    await expect(service.listByUser(validUserId)).resolves.toEqual([])
  })

  it('updates status for valid task', async () => {
    taskRepo.findById.mockImplementation(async (id: string) => {
      if (id === validTaskId) return { id, status: TaskStatus.PENDING }
      return null
    })
    const res = await service.updateStatus(validTaskId, TaskStatus.DONE)
    expect(res).toEqual({ id: validTaskId, status: TaskStatus.DONE })
  })

  it('throws BadRequestException for invalid task id in updateStatus', async () => {
    await expect(service.updateStatus('not-a-uuid', TaskStatus.DONE)).rejects.toBeInstanceOf(BadRequestException)
    await expect(service.updateStatus('12345678-1234-1234-1234-1234567890', TaskStatus.DONE)).rejects.toBeInstanceOf(BadRequestException)
  })

  it('soft deletes for valid task', async () => {
    taskRepo.findById.mockImplementation(async (id: string) => {
      if (id === validTaskId) return { id }
      return null
    })
    await expect(service.softDelete(validTaskId)).resolves.toEqual({ success: true })
  })

  it('throws BadRequestException for invalid task id in softDelete', async () => {
    await expect(service.softDelete('not-a-uuid')).rejects.toBeInstanceOf(BadRequestException)
    await expect(service.softDelete('12345678-1234-1234-1234-1234567890')).rejects.toBeInstanceOf(BadRequestException)
  })
})
