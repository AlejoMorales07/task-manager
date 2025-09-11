import { TaskStatus } from '@/task/domain/task.entity'
import { IsEnum, IsNotEmpty } from 'class-validator'

export class UpdateTaskStatusDto {
  /**
   * New status of the task
   * @example "IN_PROGRESS"
   */
  @IsNotEmpty()
  @IsEnum(TaskStatus)
  status!: TaskStatus
}
