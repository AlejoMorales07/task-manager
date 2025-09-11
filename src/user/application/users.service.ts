import { User } from '@/user/domain/user.entity'
import { UserRepository } from '@/user/domain/user.repository'
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { ICreateUser } from '../domain/create-user.interface'
import { isUUID } from 'class-validator'

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UserRepository) {}

  async create(input: ICreateUser): Promise<User> {
    const user = await this.usersRepo.findByEmail(input.email)
    if (user) throw new ConflictException('User already exists')
    return await this.usersRepo.create({
      email: input.email,
      name: input.name
    })
  }

  async getById(id: string): Promise<User> {
    if (!isUUID(id)) throw new BadRequestException('Invalid user ID')
    const user = await this.usersRepo.findById(id)
    if (!user) throw new NotFoundException('User not found')
    return user
  }
}
