import { AuthenticateUseCase } from '@/domain/login/application/use-cases/authenticate'
import { Body, Controller, Post } from '@nestjs/common'
import z from 'zod'

import { Public } from '@/infra/auth/public'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { AuthenticatePresenter } from '../presenters/authenticate-presenter'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(authenticateBodySchema)

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(private authenticateUseCase: AuthenticateUseCase) {}

  @Post()
  async handle(@Body(bodyValidationPipe) body: AuthenticateBodySchema) {
    const { email, password } = body

    const result = await this.authenticateUseCase.execute({
      email,
      password,
    })

    return AuthenticatePresenter.toHTTP(result)
  }
}
