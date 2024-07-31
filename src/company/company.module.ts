import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { TenantsModule } from 'src/tenants/tenants.module';
import { tenantModels } from 'src/common/providers/tenant-models-provider';
import { JwtService } from '@nestjs/jwt';
import { TenantsMiddleware } from 'src/common/middlewares/tenants.middleware';
import { MembersModule } from 'src/members/members.module';
import { MembersService } from 'src/members/members.service';
import { GeocodeService } from 'src/geocode/geocode.services';

@Module({
  imports: [TenantsModule, MembersModule],
  controllers: [CompanyController],
  providers: [
    CompanyService,
    MembersService,
    GeocodeService,
    tenantModels.membersModel,
    tenantModels.companyModel,
    JwtService,
  ],
  exports: [CompanyService],
})
export class CompanyModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantsMiddleware).forRoutes(CompanyController);
  }
}
