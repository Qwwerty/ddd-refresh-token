import { Body, Controller, Post } from '@nestjs/common'
import z from 'zod'
import { JwtService } from '@nestjs/jwt'

import { RefreshTokenUseCase } from '@/domain/login/application/use-cases/refresh-token'
import { Public } from '@/infra/auth/public'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { AuthenticatePresenter } from '../presenters/authenticate-presenter'

const refreshBodySchema = z.object({
  token: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(refreshBodySchema)

type RefreshTokenBodySchema = z.infer<typeof refreshBodySchema>

@Controller('/refresh-token')
@Public()
export class RefreshTokenController {
  constructor(
    private refreshTokenUseCase: RefreshTokenUseCase,
    private jwtService: JwtService,
  ) {}

  @Post()
  async handle(@Body(bodyValidationPipe) body: RefreshTokenBodySchema) {
    const { token } = body
    
    const { sub: refreshTokenId } = await this.jwtService.verifyAsync(token)

    const result = await this.refreshTokenUseCase.execute({
      refreshTokenId,
    })

    return AuthenticatePresenter.toHTTP(result)
  }
}
