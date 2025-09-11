import { TaskEntity } from '@/task/infrastructure/typeorm/task.entity'
import { UserEntity } from '@/user/infrastructure/typeorm/user.entity'
import { Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'

export class TypeOrmConfig implements TypeOrmOptionsFactory {
  constructor(@Inject() private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST') || 'localhost',
      port: this.configService.get<number>('DB_PORT') || 5432,
      username: this.configService.get<string>('DB_USER') || 'postgres',
      password: this.configService.get<string>('DB_PASSWORD') || 'postgres',
      database: this.configService.get<string>('DB_NAME') || 'task_manager',
      entities: [UserEntity, TaskEntity],
      synchronize: true
    }
  }
}
