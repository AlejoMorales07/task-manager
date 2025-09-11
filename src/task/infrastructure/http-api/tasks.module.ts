import { TasksService } from '@/task/application/tasks.service'
import { TaskRepository } from '@/task/domain/task.repository'
import { TaskEntity } from '@/task/infrastructure/typeorm/task.entity'
import { TasksTypeOrmRepository } from '@/task/infrastructure/typeorm/tasks.typeorm.repository'
import { UserRepository } from '@/user/domain/user.repository'
import { UserEntity } from '@/user/infrastructure/typeorm/user.entity'
import { UsersTypeOrmRepository } from '@/user/infrastructure/typeorm/users.typeorm.repository'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TasksController } from './tasks.controller'

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity, UserEntity])],
  controllers: [TasksController],
  providers: [
    TasksService,
    { provide: TaskRepository, useClass: TasksTypeOrmRepository },
    { provide: UserRepository, useClass: UsersTypeOrmRepository }
  ]
})
export class TasksModule {}
