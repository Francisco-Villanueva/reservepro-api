import { Connection } from 'mongoose';
import { Company, CompanySchema } from 'src/company/schema/company.schema';

export const tenantModels = {
  companyModel: {
    provide: 'COMPANY_MODEL',
    useFactory: async (tenantConnection: Connection) => {
      return tenantConnection.model(Company.name, CompanySchema);
    },
    inject: ['TENANT_CONNECTION'],
  },
};
