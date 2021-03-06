import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  CryptoHelper,
  DateHelper,
  EmailHelper,
  StringHelper,
} from '@solness/core';
import { MoreThanOrEqual } from 'typeorm';
import { RefreshToken } from '../objects';
import { AuthRepository } from './../repositories';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly refreshTokenRepository: AuthRepository,
  ) {}

  private splitToken(token: string) {
    const data = token.split('.', 3);
    return { token: `${data[0]}.${data[1]}`, signature: data[2] };
  }

  public async validateUser(username: string, password: string) {
    const user = await this.userService.findOne({
      where: {
        email: username,
        enabled: true,
      },
      select: ['password', 'id', 'role'],
    });

    if (user && CryptoHelper.compare(password, user.password)) {
      delete user.password;
      return user;
    }

    return null;
  }

  public async generateToken(userId: number) {
    let userPayload = await this.userService.getUserAuthPayload(userId);

    const payload = {
      username: userPayload.email,
      sub: userPayload.id,
      role: userPayload.role,
      data: userPayload.data,
    };

    const accessToken = this.jwtService.sign(payload);
    const tokenData = this.splitToken(accessToken);
    const refreshToken = await this.createRefreshToken(userId);

    return {
      accessToken: tokenData.token,
      refreshToken,
      expiresIn: 600,
      signature: tokenData.signature,
    };
  }

  public async generateResetPasswordToken(email: string) {
    const user = await this.userService.getUserByEmail(email);
    if (user) {
      const payload = { userId: user.id };
      const token = this.jwtService.sign(payload, { expiresIn: '24h' });
      await EmailHelper.sendResetPasswordEmail(user.email, token);
    }
  }

  public async checkTokenAvailability(token: string) {
    try {
      this.jwtService.verify(token);
      return true;
    } catch {
      return false;
    }
  }

  public async refresh(refreshToken: string, accessToken: string) {
    const oldRefreshToken = await this.refreshTokenRepository.findOne({
      token: refreshToken,
      expireDate: MoreThanOrEqual(new Date()),
    });
    try {
      const accessTokenData = this.jwtService.verify(accessToken, {
        ignoreExpiration: true,
      });

      if (
        !!oldRefreshToken &&
        !!accessTokenData &&
        accessTokenData.sub === oldRefreshToken.userId
      ) {
        return await this.generateToken(oldRefreshToken.userId);
      }
    } catch {
      return null;
    }
  }

  public async logout(token: string) {
    await this.refreshTokenRepository.delete({ token });
  }

  private async createRefreshToken(userId: any) {
    const length = Math.floor(Math.random() * 70) + 80;
    const token = StringHelper.generate(length);

    const refreshToken: RefreshToken = {
      enabled: true,
      userId,
      token,
      createdUserId: userId,
      createdDatetime: new Date(),
      expireDate: DateHelper.addDays(21),
    };

    await this.refreshTokenRepository.save(refreshToken, { data: { userId } });
    return token;
  }

  async verifyAndChangePassword(token: string, newPassword: string) {
    try {
      const tokenDetails: { userId: number } = await this.jwtService.verify(
        token,
      );

      return (
        tokenDetails.userId != null &&
        this.userService.changePassword(tokenDetails.userId, newPassword)
      );
    } catch {
      return false;
    }
  }
}
