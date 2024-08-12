import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { TenantsModule } from 'src/tenants/tenants.module';
import { TenantsMiddleware } from 'src/common/middlewares/tenants.middleware';
import { JwtService } from '@nestjs/jwt';
import {
  clientsModels,
  tenantModels,
} from 'src/common/providers/tenant-models-provider';
import { CompanyService } from 'src/company/company.service';

@Module({
  imports: [TenantsModule],
  controllers: [ServicesController],
  providers: [
    ServicesService,
    CompanyService,
    JwtService,
    tenantModels.serviceModel,
    tenantModels.membersModel,
    clientsModels.clientServiceModel,
    clientsModels.clientMembersModel,
  ],
})
export class ServicesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantsMiddleware).forRoutes(ServicesController);
  }
}
