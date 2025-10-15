import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import { AuthenticateUseCase } from './authenticate';
import { User } from '../../enterprise/entities/user';
import { InMemoryRefreshTokenRepository } from 'test/repositories/in-memory-refresh-token-repository';

let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryRefreshTokenRepository: InMemoryRefreshTokenRepository;
let sut: AuthenticateUseCase;

describe('Authenticate use case', () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();

    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryRefreshTokenRepository = new InMemoryRefreshTokenRepository();

    sut = new AuthenticateUseCase(
      inMemoryUsersRepository,
      inMemoryRefreshTokenRepository,
      fakeEncrypter,
      fakeHasher,
    );
  });

  it('should not authenticate a non-existent email', async () => {
    await expect(
      sut.execute({
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toThrowError(Error);
  });

  it('should not authenticate with an incorrect password', async () => {
    inMemoryUsersRepository.items.push(
      User.create({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: await fakeHasher.hash('123456'),
      }),
    );

    await expect(
      sut.execute({
        email: 'johndoe@example.com',
        password: '1234567',
      }),
    ).rejects.toThrowError(Error);
  });

  it('should be able to retrieve the authenticate token', async () => {
    inMemoryUsersRepository.items.push(
      User.create({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: await fakeHasher.hash('123456'),
      }),
    );

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result).toStrictEqual({
      accessToken: expect.any(String),
      refreshToken: expect.objectContaining({
        expiresIn: expect.any(Number)
      })
    })

    expect(inMemoryRefreshTokenRepository.items).toHaveLength(1)
  })
});
