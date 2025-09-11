import { Task, TaskStatus } from './task.entity'

export abstract class TaskFilter {
  abstract status?: TaskStatus
}

export abstract class Pagination {
  abstract page?: number
  abstract limit?: number
}

export abstract class TaskRepository {
  abstract create(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<Task>
  abstract findById(id: string): Promise<Task | null>
  abstract findByUser(userId: string, filter?: TaskFilter, pagination?: Pagination): Promise<{ data: Task[]; total: number }>
  abstract updateStatus(id: string, status: TaskStatus): Promise<Task>
  abstract softDelete(id: string): Promise<void>
}
