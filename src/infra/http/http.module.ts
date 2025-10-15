import { Module } from '@nestjs/common'

import { RegisterUseCase } from '@/domain/login/application/use-cases/register';
import { AuthenticateUseCase } from '@/domain/login/application/use-cases/authenticate';

import { CryptographyModule } from '../cryptography/cryptography.module';
import { RegisterController } from './controllers/register.controller';
import { DatabaseModule } from '../database/database.module';
import { AuthenticateController } from './controllers/authenticate.controller';
import { HelloWorldController } from './controllers/hello-world.controller';
import { RefreshTokenController } from './controllers/refresh-token.controller.e2e';
import { RefreshTokenUseCase } from '@/domain/login/application/use-cases/refresh-token';

@Module({
  imports: [CryptographyModule, DatabaseModule],
  controllers: [
    RegisterController,
    AuthenticateController,
    HelloWorldController,
    RefreshTokenController
  ],
  providers: [
    RegisterUseCase,
    AuthenticateUseCase,
    RefreshTokenUseCase
  ]
})
export class HttpModule {}
