import { ICreateTask } from '@/task/domain/create-task.interface'
import { TaskStatus } from '@/task/domain/task.entity'
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'

export class CreateTaskDto implements ICreateTask {
  /**
   * Title of the task
   * @example "Complete the project documentation"
   */
  @IsNotEmpty()
  @MaxLength(200)
  title!: string

  /**
   * Description of the task
   * @example "Write detailed documentation for the new project including setup instructions and API references."
   */
  @IsOptional()
  @IsString()
  description?: string

  /**
   * Status of the task
   * @example "PENDING"
   */
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus

  /**
   * Due date of the task in ISO 8601 format
   * @example "2023-12-31T23:59:59Z"
   */
  @IsOptional()
  @IsDateString()
  dueDate?: string

  /**
   * ID of the user to whom the task is assigned
   * @example "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6"
   */
  @IsNotEmpty()
  userId!: string
}
