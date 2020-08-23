import { UserContext } from '@solness/core';

export interface UserService {
  findOne(request: any): Promise<any>;
  getUserAuthPayload(userId: number): Promise<UserContext>;
  getUserByEmail(email: string): Promise<any>;
  changePassword(userId: number, newPassword: string): Promise<boolean>;
}
