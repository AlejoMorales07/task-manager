import { Task, TaskStatus } from '@/task/domain/task.entity'
import { Pagination, TaskFilter, TaskRepository } from '@/task/domain/task.repository'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TaskEntity } from './task.entity'

@Injectable()
export class TasksTypeOrmRepository extends TaskRepository {
  constructor(@InjectRepository(TaskEntity) private readonly repo: Repository<TaskEntity>) {
    super()
  }

  async create(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<Task> {
    const entity = this.repo.create(data)
    const saved = await this.repo.save(entity)
    return saved as unknown as Task
  }

  async findById(id: string): Promise<Task | null> {
    const found = await this.repo.findOne({ where: { id } })
    return found ?? null
  }

  async findByUser(userId: string, filter?: TaskFilter, pagination?: Pagination): Promise<{ data: Task[]; total: number }> {
    const qb = this.repo.createQueryBuilder('task').where('task.userId = :userId', { userId }).andWhere('task.deletedAt IS NULL')
    if (filter?.status) qb.andWhere('task.status = :status', { status: filter.status })
    const page = Math.max(1, pagination?.page || 1)
    const limit = Math.min(100, Math.max(1, pagination?.limit || 10))
    qb.skip((page - 1) * limit)
      .take(limit)
      .orderBy('task.createdAt', 'DESC')
    const [data, total] = await qb.getManyAndCount()
    return { data: data, total }
  }

  async updateStatus(id: string, status: TaskStatus): Promise<Task> {
    await this.repo.update({ id }, { status })
    const updated = await this.repo.findOne({ where: { id } })
    return updated as unknown as Task
  }

  async softDelete(id: string): Promise<void> {
    await this.repo.softDelete({ id })
  }
}
