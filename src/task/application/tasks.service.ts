import { TaskStatus } from '@/task/domain/task.entity'
import { TaskRepository } from '@/task/domain/task.repository'
import { UserRepository } from '@/user/domain/user.repository'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { isUUID } from 'class-validator'
import { ICreateTask } from '../domain/create-task.interface'

@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepo: TaskRepository,
    private readonly usersRepo: UserRepository
  ) {}

  async create(input: ICreateTask) {
    if (!isUUID(input.userId)) throw new BadRequestException('Invalid user ID')
    const user = await this.usersRepo.findById(input.userId)
    if (!user) throw new NotFoundException('User not found')
    const nowStatus: TaskStatus = input.status ?? TaskStatus.PENDING
    return this.tasksRepo.create({
      title: input.title,
      description: input.description ?? null,
      status: nowStatus,
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
      userId: input.userId
    })
  }

  async listByUser(userId: string, filter?: { status?: TaskStatus }, pagination?: { page?: number; limit?: number }) {
    if (!isUUID(userId)) throw new BadRequestException('Invalid user ID')
    if (pagination?.page! < 1 || pagination?.limit! < 1) throw new BadRequestException('Invalid pagination parameters')
    const user = await this.usersRepo.findById(userId)
    if (!user) throw new NotFoundException('User not found')
    return this.tasksRepo.findByUser(userId, filter, pagination)
  }

  async updateStatus(id: string, status: TaskStatus) {
    if (!isUUID(id)) throw new BadRequestException('Invalid task ID')
    if (!Object.values(TaskStatus).includes(status)) throw new BadRequestException('Invalid status')
    const task = await this.tasksRepo.findById(id)
    if (!task) throw new NotFoundException('Task not found')
    return this.tasksRepo.updateStatus(id, status)
  }

  async softDelete(id: string) {
    if (!isUUID(id)) throw new BadRequestException('Invalid task ID')
    const task = await this.tasksRepo.findById(id)
    if (!task) throw new NotFoundException('Task not found')
    await this.tasksRepo.softDelete(id)
    return { success: true }
  }
}
