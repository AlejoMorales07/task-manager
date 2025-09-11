import { UsersService } from '@/user/application/users.service'
import { UserRepository } from '@/user/domain/user.repository'
import { UserEntity } from '@/user/infrastructure/typeorm/user.entity'
import { UsersTypeOrmRepository } from '@/user/infrastructure/typeorm/users.typeorm.repository'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersController } from './users.controller'

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [UsersService, { provide: UserRepository, useClass: UsersTypeOrmRepository }],
  exports: [UsersService]
})
export class UsersModule {}
