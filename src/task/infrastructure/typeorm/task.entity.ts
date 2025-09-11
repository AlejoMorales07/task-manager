import { TaskStatus } from '@/task/domain/task.entity'
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { UserEntity } from '../../../user/infrastructure/typeorm/user.entity'

@Entity('tasks')
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  title!: string

  @Column({ type: 'text', nullable: true })
  description!: string | null

  @Column({ type: 'varchar', default: TaskStatus.PENDING })
  status!: TaskStatus

  @Column({ type: 'timestamp', nullable: true })
  dueDate!: Date | null

  @Column()
  userId!: string

  @ManyToOne(() => UserEntity)
  user!: UserEntity

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn({ nullable: true })
  deletedAt!: Date | null
}
