import { UserContext } from '@solness/core';
import { NotImplementedException } from '@nestjs/common';

export class UserService {
  public findOne(request: any): Promise<any> {
    throw NotImplementedException;
  }

  public getUserAuthPayload(userId: number): Promise<UserContext> {
    throw NotImplementedException;
  }

  public getUserByEmail(email: string): Promise<any> {
    throw NotImplementedException;
  }

  public changePassword(userId: number, newPassword: string): Promise<boolean> {
    throw NotImplementedException;
  }
}
