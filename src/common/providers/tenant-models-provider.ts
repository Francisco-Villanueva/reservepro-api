import { Connection } from 'mongoose';
import { Company, CompanySchema } from 'src/company/schema/company.schema';
import { Member, MemberSchema } from 'src/members/schema/member.schema';

export const tenantModels = {
  companyModel: {
    provide: 'COMPANY_MODEL',
    useFactory: async (tenantConnection: Connection) => {
      return tenantConnection.model(Company.name, CompanySchema);
    },
    inject: ['TENANT_CONNECTION'],
  },
  membersModel: {
    provide: 'MEMBER_MODEL',
    useFactory: async (tenantConnection: Connection) => {
      return tenantConnection.model(Member.name, MemberSchema);
    },
    inject: ['TENANT_CONNECTION'],
  },
};
