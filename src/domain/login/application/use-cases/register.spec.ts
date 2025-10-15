import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { RegisterUseCase } from './register';
import { User } from '../../enterprise/entities/user';
import { FakeHasher } from 'test/cryptography/fake-hasher';

let fakeHasher: FakeHasher;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe('Register use case', () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(inMemoryUsersRepository, fakeHasher);
  });

  it('should not be possible to register with duplicate email', async () => {
    inMemoryUsersRepository.items.push(
      User.create({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      }),
    );

    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toThrowError(Error);
  });

  it("should generate a hash of the user's password", async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(inMemoryUsersRepository.items[0].password).not.toBe('123456');
  });
});
