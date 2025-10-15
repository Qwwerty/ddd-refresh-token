import {
  Prisma,
  RefreshToken as PrismaRefreshToken,
  User as PrismaUser,
} from '@prisma/client'

import { RefreshToken } from '@/domain/login/enterprise/entities/refresh-token'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { User } from '@/domain/login/enterprise/entities/user'

type PrismaRefreshTokenDetails = PrismaRefreshToken & {
  user: PrismaUser
}

export class PrismaRefreshTokenMapper {
  static toDomain(raw: PrismaRefreshTokenDetails) {
    return RefreshToken.create(
      {
        token: raw.token,
        expiresIn: Number(raw.expiresIn),
        user: User.create(
          {
            name: raw.user.name,
            email: raw.user.email,
            password: raw.user.password,
          },
          new UniqueEntityId(raw.user.id),
        ),
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(
    refreshToken: RefreshToken,
  ): Prisma.RefreshTokenUncheckedCreateInput {
    return {
      id: refreshToken.id.toString(),
      token: refreshToken.token,
      expiresIn: refreshToken.expiresIn,
      userId: refreshToken.user.id.toString(),
    }
  }
}
