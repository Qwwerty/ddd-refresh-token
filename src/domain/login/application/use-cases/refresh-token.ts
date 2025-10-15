import dayjs from 'dayjs'
import { RefreshTokenRepository } from '../repositories/refresh-token-repository'
import { Encrypter } from '../cryptography/encrypter'
import { RefreshToken } from '../../enterprise/entities/refresh-token'
import { Injectable } from '@nestjs/common'

interface AuthenticateRefreshTokenUseCaseRequest {
  refreshTokenId: string
}

@Injectable()
export class RefreshTokenUseCase {
  private readonly SEVEN_DAYS_IN_SECONDS = 7 * 24 * 60 * 60

  constructor(
    private refreshTokenRepository: RefreshTokenRepository,
    private encrypter: Encrypter,
  ) {}

  async execute({ refreshTokenId }: AuthenticateRefreshTokenUseCaseRequest) {
    const existingToken =
      await this.refreshTokenRepository.findById(refreshTokenId)

    if (!existingToken) {
      throw new Error('Invalid refresh token.')
    }

    const currentTimestamp = Math.floor(Date.now() / 1000)

    if (currentTimestamp > existingToken.expiresIn) {
      throw new Error('Refresh token expired.')
    }

    await this.refreshTokenRepository.delete(existingToken)

    const expiresIn = currentTimestamp + this.SEVEN_DAYS_IN_SECONDS

    const newRefreshToken = RefreshToken.create({
      token: '',
      expiresIn,
      user: existingToken.user,
    })

    const [accessToken, refreshTokenJwt] = await Promise.all([
      this.encrypter.encrypt(
        { sub: existingToken.user.id.toString() }
      ),
      this.encrypter.encrypt({ sub: newRefreshToken.id.toString() }, '7d'),
    ])

    newRefreshToken.token = refreshTokenJwt
    await this.refreshTokenRepository.create(newRefreshToken)

    return {
      accessToken,
      refreshToken: newRefreshToken,
    }
  }
}
