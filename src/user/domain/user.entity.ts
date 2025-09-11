export class User {
  /**
   * Unique identifier for the user
   * @example "a3bb189e-8bf9-3888-9912-ace4e6543002"
   */
  id!: string

  /**
   * Email address of the user
   * @example "user@example.com"
   */
  email!: string

  /**
   * Name of the user
   * @example "John Doe"
   */
  name!: string

  /**
   * Date when the user was created
   * @example "2023-01-01T00:00:00Z"
   */
  createdAt!: Date
}
