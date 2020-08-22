import { BaseEntity } from '@solness/core';
import { Column, Entity } from 'typeorm';

@Entity('refreshToken')
export class RefreshToken extends BaseEntity {
  @Column()
  userId: number;

  @Column({ length: 250 })
  token: string;

  @Column()
  expireDate: Date;
}
