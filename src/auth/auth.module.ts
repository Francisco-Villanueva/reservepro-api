import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TenantsModule } from 'src/tenants/tenants.module';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TenantsModule, ConfigModule],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
})
export class AuthModule {}
