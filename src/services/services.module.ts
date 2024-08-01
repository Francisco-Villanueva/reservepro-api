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

@Module({
  imports: [TenantsModule],
  controllers: [ServicesController],
  providers: [
    ServicesService,
    JwtService,
    tenantModels.serviceModel,
    clientsModels.clientServiceModel,
  ],
})
export class ServicesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantsMiddleware).forRoutes(ServicesController);
  }
}
