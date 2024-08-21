import { Inject, Injectable } from '@nestjs/common';
import {
  CLIENT_COMPANY_MODEL,
  CLIENT_MEMBER_MODEL,
  CLIENT_SERVICE_MODEL,
} from 'src/common/providers/constants';
import { CompanyModel } from 'src/company/schema/company.schema';
import { Member, MemberModel } from 'src/members/schema/member.schema';
import { ServiceModel } from 'src/services/schema/services.schema';

@Injectable()
export class ClientService {
  constructor(
    @Inject(CLIENT_COMPANY_MODEL)
    private readonly clientCompanyModel: CompanyModel,
    @Inject(CLIENT_MEMBER_MODEL)
    private readonly clientMemberModel: MemberModel,
    @Inject(CLIENT_SERVICE_MODEL)
    private readonly clientServicesModel: ServiceModel,
  ) {}

  async getCompanies(name: string, category: string, city: string) {
    const query: any = {};
    if (name && name.length) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (category && category.length) {
      query.category = { $in: [category] };
    }

    if (city && city.length) {
      query['address.city'] = { $regex: city, $options: 'i' };
    }
    return await this.clientCompanyModel.find(query);
  }
  async getCompanyById(id: string) {
    return await this.clientCompanyModel.findOne({ _id: id });
  }
  async getServiceById(id: string) {
    return await this.clientServicesModel.findOne({ _id: id });
  }
  async getMemberById(id: string) {
    return await this.clientMemberModel.findOne({ _id: id });
  }
  async getMembers() {
    return await this.clientMemberModel.find();
  }

  async getServicesFromCompany(companyId: string) {
    const company = await this.getCompanyById(companyId);

    const servicesPromises = company.services.map(
      async (serviceId) => await this.clientServicesModel.findById(serviceId),
    );

    return await Promise.all(servicesPromises);
  }
  async getMembersFromCompany(companyId: string) {
    const company = await this.getCompanyById(companyId);

    const membersPromises = company.members.map(
      async (memberId) => await this.clientMemberModel.findById(memberId),
    );

    return await Promise.all(membersPromises);
  }

  async getMembersFromServices(serviceId: string): Promise<Member[]> {
    const res = await this.clientServicesModel.findById(serviceId);

    if (!res) {
      throw new Error('service not found');
    }

    const servicesPromises = res.members.map(
      async (memberId) => await this.clientMemberModel.findById(memberId),
    );
    return await Promise.all(servicesPromises);
  }
}
