import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppHelper } from '@solness/core';
import { AuthKeys, RefreshToken } from './objects';
import { AuthService } from './services';
import { JwtStrategy, LocalStrategy } from './strategies';

@Module({
  imports: [
    JwtModule.register({
      secret: AppHelper.getConfig(AuthKeys.AuthSecret),
      signOptions: { expiresIn: '10m' },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([RefreshToken]),
  ],
})
export class AuthModule {
  static forRoot(userService: any): DynamicModule {
    return {
      module: AuthModule,
      providers: [
        LocalStrategy,
        JwtStrategy,
        {
          provide: 'USER_SERVICE',
          useClass: userService,
        },
      ],
    };
  }
}
