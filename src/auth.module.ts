import { DynamicModule, Module, Provider } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppHelper } from '@solness/core';
import { AuthKeys, RefreshToken } from './objects';
import { AuthService, UserService } from './services';
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
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {
  static forRoot(userService: any, providers?: Provider[]): DynamicModule {
    return {
      module: AuthModule,
      providers: [
        {
          provide: UserService,
          useClass: userService,
        },
        ...providers,
      ],
    };
  }
}
