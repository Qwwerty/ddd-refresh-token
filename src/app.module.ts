import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { envSchema } from './infra/env/env'
import { EnvService } from './infra/env/env.service'
import { HttpModule } from './infra/http/http.module'
import { AuthModule } from './infra/auth/auth.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true
    }),
    HttpModule,
    AuthModule
  ],
  providers: [EnvService],
})
export class AppModule {}
