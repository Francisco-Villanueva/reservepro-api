import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { tenantModels } from 'src/common/providers/tenant-models-provider';
import { TenantsMiddleware } from 'src/common/middlewares/tenants.middleware';
import { TenantsModule } from 'src/tenants/tenants.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TenantsModule],
  controllers: [CustomerController],
  providers: [CustomerService, tenantModels.customerModel, JwtService],
})
export class CustomerModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantsMiddleware).forRoutes(CustomerController);
  }
}
