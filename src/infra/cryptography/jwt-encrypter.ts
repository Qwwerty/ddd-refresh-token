import { Injectable } from '@nestjs/common'
import { JwtService, JwtSignOptions } from '@nestjs/jwt'
import { Encrypter } from '@/domain/login/application/cryptography/encrypter'

@Injectable()
export class JwtEncrypter implements Encrypter {
  constructor(private jwtService: JwtService) {}

  encrypt(
    payload: Record<string, unknown>,
    expiresIn: JwtSignOptions['expiresIn'] = '1m',
  ): Promise<string> {
    return this.jwtService.signAsync(payload, { expiresIn })
  }
}
