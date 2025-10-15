import { Injectable } from '@nestjs/common';

import { User } from '../../enterprise/entities/user';
import { HashGenerator } from '../cryptography/hash-generator';
import { UsersRepository } from '../repositories/users-repository';

interface RegisterSellerUseCaseProps {
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class RegisterUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({ name, email, password }: RegisterSellerUseCaseProps) {
    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new Error('User with same email.');
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const user = User.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.usersRepository.create(user);
  }
}
