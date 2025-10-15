import { Injectable } from '@nestjs/common'
import { RefreshToken } from '../../enterprise/entities/refresh-token'
import { Encrypter } from '../cryptography/encrypter'
import { HashComparer } from '../cryptography/hash-comparer'
import { RefreshTokenRepository } from '../repositories/refresh-token-repository'
import { UsersRepository } from '../repositories/users-repository'

interface AuthenticateSellerUseCaseRequest {
  email: string
  password: string
}

@Injectable()
export class AuthenticateUseCase {
  private readonly SEVEN_DAYS_IN_SECONDS = 7 * 24 * 60 * 6

  constructor(
    private usersRepository: UsersRepository,
    private refreshTokenRepository: RefreshTokenRepository,
    private encrypter: Encrypter,
    private hashComparer: HashComparer,
  ) {}

  async execute({ email, password }: AuthenticateSellerUseCaseRequest) {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new Error('Credentials are not valid.')
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      user.password,
    )

    if (!isPasswordValid) {
      throw new Error('Credentials are not valid.')
    }

    const existingRefreshToken = await this.refreshTokenRepository.findByUserId(user.id.toString())

    if (existingRefreshToken) {
      await this.refreshTokenRepository.delete(existingRefreshToken)
    }

    const currentTimestamp = Math.floor(Date.now() / 1000)
    const expiresIn = currentTimestamp + this.SEVEN_DAYS_IN_SECONDS

    const newRefreshToken = RefreshToken.create({
      token: '',
      expiresIn,
      user,
    })

    const [accessToken, refreshTokenJwt] = await Promise.all([
      this.encrypter.encrypt({ sub: user.id.toString() }),
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
