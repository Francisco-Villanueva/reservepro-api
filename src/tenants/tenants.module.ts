import { Module } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Tenant, TenantSchema } from './schemas/tenant.schema';
import {
  clientsConnectionProvider,
  tenantConnectionProvider,
} from 'src/common/providers/tenant-connection.provider';
import {
  clientsModels,
  tenantModels,
} from 'src/common/providers/tenant-models-provider';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tenant.name, schema: TenantSchema }]),
  ],
  providers: [
    TenantsService,
    tenantConnectionProvider,
    clientsConnectionProvider,
    ...Object.values(tenantModels),
    ...Object.values(clientsModels),
  ],
  exports: [
    TenantsService,
    tenantConnectionProvider,
    clientsConnectionProvider,
    ...Object.values(tenantModels),
    ...Object.values(clientsModels),
  ],
})
export class TenantsModule {}
