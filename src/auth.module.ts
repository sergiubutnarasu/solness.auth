import { DynamicModule, Module, Type } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppHelper } from '@solness/core';
import { AuthKeys } from './objects';
import { AuthRepository } from './repositories';
import { AuthService, UserService } from './services';
import { JwtStrategy, LocalStrategy } from './strategies';

@Module({
  imports: [
    JwtModule.register({
      secret: AppHelper.getConfig(AuthKeys.AuthSecret),
      signOptions: { expiresIn: '10m' },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([AuthRepository]),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [
    AuthService,
    JwtModule,
    LocalStrategy,
    JwtStrategy,
    TypeOrmModule.forFeature([AuthRepository]),
  ],
})
export class AuthModule {
  static forRoot(userService: Type<any>, imports: any[]): DynamicModule {
    return {
      module: AuthModule,
      imports,
      providers: [
        {
          provide: UserService,
          useClass: userService,
        },
      ],
    };
  }
}
