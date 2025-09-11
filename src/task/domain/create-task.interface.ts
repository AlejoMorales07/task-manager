import { TaskStatus } from './task.entity'

export interface ICreateTask {
  title: string
  description?: string
  status?: TaskStatus
  dueDate?: string | Date
  userId: string
}
