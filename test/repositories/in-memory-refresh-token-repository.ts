import { RefreshTokenRepository } from 'src/domain/login/application/repositories/refresh-token-repository'
import { RefreshToken } from 'src/domain/login/enterprise/entities/refresh-token'

export class InMemoryRefreshTokenRepository implements RefreshTokenRepository {
  public items: RefreshToken[] = []

  async findByUserId(userId: string): Promise<RefreshToken | null> {
        const refreshToken = this.items.find(
      (item) => item.user.id.toString() === userId,
    )

    if (!refreshToken) {
      return null
    }

    return refreshToken
  }

  async findById(refreshTokenId: string): Promise<RefreshToken | null> {
    const refreshToken = this.items.find(
      (item) => item.id.toString() === refreshTokenId,
    )

    if (!refreshToken) {
      return null
    }

    return refreshToken
  }

  async create(refreshToken: RefreshToken): Promise<void> {
    this.items.push(refreshToken)
  }

  async delete(refreshToken: RefreshToken): Promise<void> {
    this.items = this.items.filter((item) => !item.id.equals(refreshToken.id))
  }
}
