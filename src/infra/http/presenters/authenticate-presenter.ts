import { RefreshToken } from '@/domain/login/enterprise/entities/refresh-token'

interface AuthenticateProps {
  accessToken: string
  refreshToken: RefreshToken
}

export class AuthenticatePresenter {
  static toHTTP(props: AuthenticateProps) {
    return {
      access_token: props.accessToken,
      refresh_token: props.refreshToken.token
    }
  }
}
