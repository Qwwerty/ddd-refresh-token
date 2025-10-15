import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { hash } from 'bcryptjs'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { AppModule } from '@/app.module'

describe('Refresh token (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /users', async () => {
    await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: await hash('123456', 8),
      },
    })

    const authenticateResponse = await request(app.getHttpServer())
      .post('/sessions')
      .send({
        email: 'johndoe@example.com',
        password: '123456',
      })

    const refresh_token = authenticateResponse.body.refresh_token

    const refreshTokenResponse = await request(app.getHttpServer())
      .post('/refresh-token')
      .send({
        token: refresh_token,
      })

    expect(refreshTokenResponse.body).toStrictEqual(
      expect.objectContaining({
        access_token: expect.any(String),
        refresh_token: expect.any(String),
      }),
    )

    expect(refresh_token).not.toBe(refreshTokenResponse.body.refresh_token)
  })
})
