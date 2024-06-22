import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { tenantModels } from 'src/common/providers/tenant-models-provider';
import { TenantsModule } from 'src/tenants/tenants.module';
import { JwtService } from '@nestjs/jwt';
import { TenantsMiddleware } from 'src/common/middlewares/tenants.middleware';
import { CompanyService } from 'src/company/company.service';
import { CompanyModule } from 'src/company/company.module';

@Module({
  imports: [TenantsModule],
  controllers: [MembersController],
  providers: [
    JwtService,
    MembersService,
    tenantModels.membersModel,
    tenantModels.companyModel,
    CompanyService,
  ],
  exports: [MembersService],
})
export class MembersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantsMiddleware).forRoutes(MembersController);
  }
}
