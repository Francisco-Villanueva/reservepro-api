import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { tenantModels } from 'src/common/providers/tenant-models-provider';
import { TenantsModule } from 'src/tenants/tenants.module';
import { JwtService } from '@nestjs/jwt';
import { TenantsMiddleware } from 'src/common/middlewares/tenants.middleware';
import { CompanyController } from 'src/company/company.controller';

@Module({
  imports: [TenantsModule],
  providers: [MembersService, tenantModels.membersModel, JwtService],
  controllers: [MembersController],
})
export class MembersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantsMiddleware).forRoutes(CompanyController);
  }
}
