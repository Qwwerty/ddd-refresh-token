import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { InMemoryRefreshTokenRepository } from 'test/repositories/in-memory-refresh-token-repository'

import { User } from '../../enterprise/entities/user'
import { RefreshTokenUseCase } from './refresh-token'
import { RefreshToken } from '../../enterprise/entities/refresh-token'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import dayjs from 'dayjs'

let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryRefreshTokenRepository: InMemoryRefreshTokenRepository
let sut: RefreshTokenUseCase

describe('Refresh Token use case', () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()

    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryRefreshTokenRepository = new InMemoryRefreshTokenRepository()

    sut = new RefreshTokenUseCase(inMemoryRefreshTokenRepository, fakeEncrypter)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should not allow using an noexistent refresh token', async () => {
    const user = User.create(
      {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: await fakeHasher.hash('123456'),
      },
      new UniqueEntityId('user-1'),
    )

    inMemoryUsersRepository.items.push(user)

    await expect(
      sut.execute({ refreshTokenId: 'refresh-token-id' }),
    ).rejects.toThrowError(Error)
  })

  it('should not allow using an expired refresh token', async () => {
    vi.setSystemTime(new Date(2025, 0, 2, 0, 0))

    const user = User.create(
      {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: await fakeHasher.hash('123456'),
      },
      new UniqueEntityId('user-1'),
    )

    inMemoryUsersRepository.items.push(user)

    inMemoryRefreshTokenRepository.items.push(
      RefreshToken.create(
        {
          expiresIn: dayjs('2025-01-01T15:00:00-03:00').unix(),
          token: await fakeEncrypter.encrypt({
            sub: 'refresh-token-test',
          }),
          user,
        },
        new UniqueEntityId('refresh-token-test'),
      ),
    )

    await expect(
      sut.execute({ refreshTokenId: 'refresh-token-test' }),
    ).rejects.toThrowError(Error)
  })

  it('should be able to generate a new refresh token', async () => {
    vi.setSystemTime(new Date(2025, 0, 1, 0, 0))

    const user = User.create(
      {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: await fakeHasher.hash('123456'),
      },
      new UniqueEntityId('user-1'),
    )

    inMemoryUsersRepository.items.push(user)

    inMemoryRefreshTokenRepository.items.push(
      RefreshToken.create(
        {
          expiresIn: dayjs('2025-01-03T15:00:00-03:00').unix(),
          token: await fakeEncrypter.encrypt({
            sub: 'refresh-token-test',
          }),
          user,
        },
        new UniqueEntityId('refresh-token-test'),
      ),
    )

    const result = await sut.execute({ refreshTokenId: 'refresh-token-test' })


    expect(result).toStrictEqual({
      accessToken: expect.any(String),
      refreshToken: expect.objectContaining({
        expiresIn: expect.any(Number),
      }),
    })

    expect(inMemoryRefreshTokenRepository.items).toHaveLength(1)
    expect(inMemoryRefreshTokenRepository.items[0].token).not.toBe('refresh-token-test')
  })
})
