export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export abstract class Task {
  /**
   * Unique identifier for the task
   * @example "a3bb189e-8bf9-3888-9912-ace4e6543002"
   */
  abstract id: string

  /**
   * Title of the task
   * @example "Implement user authentication"
   */
  abstract title: string

  /**
   * Description of the task
   * @example "Implement JWT authentication for user login"
   */
  abstract description?: string | null

  /**
   * Current status of the task
   * @example "IN_PROGRESS"
   */
  abstract status: TaskStatus

  /**
   * Due date for the task
   * @example "2023-01-01T00:00:00Z"
   */
  abstract dueDate?: Date | null

  /**
   * Unique identifier for the user assigned to the task
   * @example "a3bb189e-8bf9-3888-9912-ace4e6543002"
   */
  abstract userId: string

  /**
   * Date when the task was created
   * @example "2023-01-01T00:00:00Z"
   */
  abstract createdAt: Date

  /**
   * Date when the task was last updated
   * @example "2023-01-01T00:00:00Z"
   */
  abstract updatedAt: Date

  /**
   * @deprecated
   */
  abstract deletedAt?: Date | null
}
