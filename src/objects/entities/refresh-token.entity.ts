import { BaseEntity } from '@solness/core';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('refreshToken')
export class RefreshToken extends BaseEntity {
  @Column()
  userId: number;

  @ManyToOne('User', { nullable: false })
  user?: any;

  @Column({ length: 250 })
  token: string;

  @Column()
  expireDate: Date;
}
