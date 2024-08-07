import { Inject, Injectable } from '@nestjs/common';
import {
  CLIENT_COMPANY_MODEL,
  CLIENT_MEMBER_MODEL,
} from 'src/common/providers/constants';
import { CompanyModel } from 'src/company/schema/company.schema';
import { MemberModel } from 'src/members/schema/member.schema';

@Injectable()
export class ClientService {
  constructor(
    @Inject(CLIENT_COMPANY_MODEL)
    private readonly clientCompanyModel: CompanyModel,
    @Inject(CLIENT_MEMBER_MODEL)
    private readonly clientMemberModel: MemberModel,
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
  async getMembers() {
    return await this.clientMemberModel.find();
  }
}
