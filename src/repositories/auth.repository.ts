import { RefreshToken } from './../objects';
import { EntityRepository } from 'typeorm';
import { BaseRepository } from '@solness/core';

@EntityRepository(RefreshToken)
export class AuthRepository extends BaseRepository<RefreshToken> {}
