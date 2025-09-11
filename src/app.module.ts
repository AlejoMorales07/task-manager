import { AppController } from '@/app.controller'
import { AppService } from '@/app.service'
import { TypeOrmConfig } from '@/persistence/infrastructure/typeorm.config'
import { TasksModule } from '@/task/infrastructure/http-api/tasks.module'
import { UsersModule } from '@/user/infrastructure/http-api/users.module'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfig
    }),
    UsersModule,
    TasksModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
