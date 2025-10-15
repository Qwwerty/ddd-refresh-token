import { Injectable } from '@nestjs/common'

import { RefreshTokenRepository } from '@/domain/login/application/repositories/refresh-token-repository'
import { RefreshToken } from '@/domain/login/enterprise/entities/refresh-token'
import { PrismaService } from '../prisma.service'
import { PrismaRefreshTokenMapper } from '../mappers/prisma-refresh-token-mapper'

@Injectable()
export class PrismaRefreshTokenRepository implements RefreshTokenRepository {
  constructor(private prisma: PrismaService) {}

  async findByUserId(userId: string): Promise<RefreshToken | null> {
    const refreshToken = await this.prisma.refreshToken.findUnique({
      where: {
        userId: userId,
      },
      include: {
        user: true
      }
    })

    if (!refreshToken) {
      return null
    }

    return PrismaRefreshTokenMapper.toDomain(refreshToken)
  }

  async findById(refreshTokenId: string): Promise<RefreshToken | null> {
    const refreshToken = await this.prisma.refreshToken.findUnique({
      where: {
        id: refreshTokenId,
      },
      include: {
        user: true
      }
    })

    if (!refreshToken) {
      return null
    }

    return PrismaRefreshTokenMapper.toDomain(refreshToken)
  }

  async create(refreshToken: RefreshToken): Promise<void> {
    const data = PrismaRefreshTokenMapper.toPrisma(refreshToken)

    await this.prisma.refreshToken.create({
      data,
    })
  }

  async delete(refreshToken: RefreshToken): Promise<void> {
    await this.prisma.refreshToken.delete({
      where: {
        id: refreshToken.id.toString()
      }
    })
  }
}
