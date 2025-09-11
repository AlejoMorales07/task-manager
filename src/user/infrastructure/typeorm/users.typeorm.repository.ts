import { User } from '@/user/domain/user.entity'
import { UserRepository } from '@/user/domain/user.repository'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from './user.entity'

@Injectable()
export class UsersTypeOrmRepository extends UserRepository {
  constructor(@InjectRepository(UserEntity) private readonly repo: Repository<UserEntity>) {
    super()
  }

  async create(data: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const entity = this.repo.create(data)
    const saved = await this.repo.save(entity)
    return saved as unknown as User
  }

  findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } })
  }

  findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } })
  }
}
