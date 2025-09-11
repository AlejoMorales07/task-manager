import { User } from './user.entity'

export abstract class UserRepository {
  abstract create(data: Omit<User, 'id' | 'createdAt'>): Promise<User>
  abstract findById(id: string): Promise<User | null>
  abstract findByEmail(email: string): Promise<User | null>
}
