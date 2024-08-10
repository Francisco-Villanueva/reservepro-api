import { Connection } from 'mongoose';
import {
  Appointment,
  AppointmentSchema,
} from 'src/appointments/schema/appointment.schema';
import { Company, CompanySchema } from 'src/company/schema/company.schema';
import { Member, MemberSchema } from 'src/members/schema/member.schema';
import { Service, ServiceSchema } from 'src/services/schema/services.schema';
import {
  APPOINTMENT_MODEL,
  CLIENT_APPOINTMENT_MODEL,
  CLIENT_COMPANY_MODEL,
  CLIENT_MEMBER_MODEL,
  CLIENT_SERVICE_MODEL,
  CLIENTS_CONNECTION,
  COMPANY_MODEL,
  CUSTOMER_MODEL,
  MEMBER_MODEL,
  SERVICE_MODEL,
  TENANT_CONNECTION,
} from './constants';
import { Customer, CustomerSchema } from 'src/customer/schema/customer.schema';

export const tenantModels = {
  companyModel: {
    provide: COMPANY_MODEL,
    useFactory: (tenantConnection: Connection) =>
      tenantConnection.model(Company.name, CompanySchema),
    inject: [TENANT_CONNECTION],
  },
  membersModel: {
    provide: MEMBER_MODEL,
    useFactory: (tenantConnection: Connection) =>
      tenantConnection.model(Member.name, MemberSchema),
    inject: [TENANT_CONNECTION],
  },
  appointmentModel: {
    provide: APPOINTMENT_MODEL,
    useFactory: (tenantConnection: Connection) =>
      tenantConnection.model(Appointment.name, AppointmentSchema),
    inject: [TENANT_CONNECTION],
  },
  serviceModel: {
    provide: SERVICE_MODEL,
    useFactory: (tenantConnection: Connection) =>
      tenantConnection.model(Service.name, ServiceSchema),
    inject: [TENANT_CONNECTION],
  },
  customerModel: {
    provide: CUSTOMER_MODEL,
    useFactory: (tenantConnection: Connection) =>
      tenantConnection.model(Customer.name, CustomerSchema),
    inject: [TENANT_CONNECTION],
  },
};

export const clientsModels = {
  clientCompanyModel: {
    provide: CLIENT_COMPANY_MODEL,
    useFactory: (invitedConnection: Connection) =>
      invitedConnection.model(Company.name, CompanySchema),
    inject: [CLIENTS_CONNECTION],
  },
  clientMembersModel: {
    provide: CLIENT_MEMBER_MODEL,
    useFactory: (invitedConnection: Connection) =>
      invitedConnection.model(Member.name, MemberSchema),
    inject: [CLIENTS_CONNECTION],
  },
  clientAppointmentModel: {
    provide: CLIENT_APPOINTMENT_MODEL,
    useFactory: (invitedConnection: Connection) =>
      invitedConnection.model(Appointment.name, AppointmentSchema),
    inject: [CLIENTS_CONNECTION],
  },
  clientServiceModel: {
    provide: CLIENT_SERVICE_MODEL,
    useFactory: (invitedConnection: Connection) =>
      invitedConnection.model(Service.name, ServiceSchema),
    inject: [CLIENTS_CONNECTION],
  },
};
