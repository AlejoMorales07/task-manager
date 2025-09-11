import { ICreateUser } from '@/user/domain/create-user.interface'
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator'

export class CreateUserDto implements ICreateUser {
  /**
   * User's email address
   * @example "user@example.com"
   */
  @IsEmail()
  email!: string

  /**
   * User's name
   * @example "John Doe"
   */
  @IsNotEmpty()
  @MaxLength(100)
  name!: string
}
