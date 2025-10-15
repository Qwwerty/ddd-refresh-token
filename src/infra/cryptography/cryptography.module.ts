import { Module } from '@nestjs/common'

import { HashComparer } from '@/domain/login/application/cryptography/hash-comparer';
import { HashGenerator } from '@/domain/login/application/cryptography/hash-generator';
import { Encrypter } from '@/domain/login/application/cryptography/encrypter';

import { BcryptHasher } from './bcrypt-hasher';
import { JwtEncrypter } from './jwt-encrypter';

@Module({
  providers: [
    { provide: HashComparer, useClass: BcryptHasher},
    { provide: HashGenerator, useClass: BcryptHasher},
    { provide: Encrypter, useClass: JwtEncrypter },
  ],
  exports: [HashComparer, HashGenerator, Encrypter]
})
export class CryptographyModule {}
