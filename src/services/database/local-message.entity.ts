import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm'

@Entity({ name: 'local-messages' })
export class LocalMessage extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'conservation_id' })
  @Index()
  conservationId: string

  @Column({ name: 'message_id', unique: true })
  @Index()
  messageId: string

  @Column({ name: 'plain_text' })
  plainText: string

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date

  @DeleteDateColumn({
    name: 'deleted_at',
  })
  deletedAt: Date
}
