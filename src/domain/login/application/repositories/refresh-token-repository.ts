import { RefreshToken } from "../../enterprise/entities/refresh-token";

export abstract class RefreshTokenRepository {
  abstract findById(refreshTokenId: string): Promise<RefreshToken | null>
  abstract findByUserId(userId: string): Promise<RefreshToken | null>
  abstract create(refreshToken: RefreshToken): Promise<void>
  abstract delete(refreshToken: RefreshToken): Promise<void>
}