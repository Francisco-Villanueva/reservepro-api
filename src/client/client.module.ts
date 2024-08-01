import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { CompanyService } from 'src/company/company.service';
import { clientsModels } from 'src/common/providers/tenant-models-provider';
import { TenantsModule } from 'src/tenants/tenants.module';
import { MembersService } from 'src/members/members.service';

@Module({
  imports: [TenantsModule],
  controllers: [ClientController],
  providers: [
    ClientService,
    clientsModels.clientCompanyModel,
    CompanyService,
    clientsModels.clientMembersModel,
    MembersService,
  ],
})
export class ClientModule {}
