import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { hash } from 'bcryptjs'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { AppModule } from '@/app.module'

describe('Refresh Token (E2E)', () => {
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

  test('[POST] /refresh-token', async () => {
    await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: await hash('123456', 8),
      },
    })

    // const authenticateResponse = await request(app.getHttpServer())
    //   .post('/sessions')
    //   .send({
    //     email: 'johndoe@example.com',
    //     password: '123456',
    //   })

    // const accessToken = authenticateResponse.body.access_token
    // const refreshToken = authenticateResponse.body.refresh_token

    const refreshTokenResponse = await request(app.getHttpServer())
      .get('/refresh-token')
      .send({
        token: 'refreshToken',
      })

    // const newAccessToken = refreshTokenResponse.body.refresh_token
    // const newRefreshToken = refreshTokenResponse.body.refresh_token

    // expect(accessToken).not.toBe(newAccessToken)
    // expect(refreshToken).not.toBe(newRefreshToken)
  })
})
