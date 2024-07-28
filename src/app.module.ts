import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvConfiguration, ZodEnvironmentsSchema } from './config';
import { CompanyModule } from './company/company.module';
import { AuthModule } from './auth/auth.module';
import { MembersModule } from './members/members.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [EnvConfiguration],
      validate: (env) => ZodEnvironmentsSchema.parse(env),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config) => ({
        uri: config.get('database.connectionString'),
      }),
      inject: [ConfigService],
    }),
    CompanyModule,
    AuthModule,
    MembersModule,
    AppointmentsModule,
    ServicesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
