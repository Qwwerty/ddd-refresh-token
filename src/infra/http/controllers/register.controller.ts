import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import z from 'zod'

import { RegisterUseCase } from '@/domain/login/application/use-cases/register'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { Public } from '@/infra/auth/public'

const registerBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(registerBodySchema)

type RegisterBodySchema = z.infer<typeof registerBodySchema>

@Controller('/users')
@Public()
export class RegisterController {
  constructor(private registerUseCase: RegisterUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: RegisterBodySchema) {
    const { name, email, password } = body

    await this.registerUseCase.execute({
      name,
      email,
      password,
    })
  }
}
