import { Injectable, NotImplementedException } from '@nestjs/common';
import { UserContext } from '@solness/core';

@Injectable()
export class UserService {
  public findOne(request: any): Promise<any> {
    throw new NotImplementedException();
  }

  public getUserAuthPayload(userId: number): Promise<UserContext> {
    throw new NotImplementedException();
  }

  public getUserByEmail(email: string): Promise<any> {
    throw new NotImplementedException();
  }

  public changePassword(userId: number, newPassword: string): Promise<boolean> {
    throw new NotImplementedException();
  }
}
