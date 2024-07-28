import { Connection } from 'mongoose';
import {
  Appointment,
  AppointmentSchema,
} from 'src/appointments/schema/appointment.schema';
import { Company, CompanySchema } from 'src/company/schema/company.schema';
import { Member, MemberSchema } from 'src/members/schema/member.schema';
import { Service, ServiceSchema } from 'src/services/schema/services.schema';

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
  appointmentModel: {
    provide: 'APPOINTMENT_MODEL',
    useFactory: async (tenantConnection: Connection) => {
      return tenantConnection.model(Appointment.name, AppointmentSchema);
    },
    inject: ['TENANT_CONNECTION'],
  },
  serviceModel: {
    provide: 'SERVICE_CONNECTION',
    useFactory: async (tenantConnection: Connection) => {
      return tenantConnection.model(Service.name, ServiceSchema);
    },
    inject: ['SERVICE_CONNECTION'],
  },
};
