import { Module } from '@nestjs/common'

import { UsersRepository } from '@/domain/login/application/repositories/users-repository'
import { RefreshTokenRepository } from '@/domain/login/application/repositories/refresh-token-repository'

import { PrismaService } from './prisma/prisma.service'
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository'
import { PrismaRefreshTokenRepository } from './prisma/repositories/prisma-refresh-token-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: RefreshTokenRepository,
      useClass: PrismaRefreshTokenRepository,
    },
  ],
  exports: [UsersRepository, RefreshTokenRepository],
})
export class DatabaseModule {}
