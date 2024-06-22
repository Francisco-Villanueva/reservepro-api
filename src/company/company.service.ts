import { Inject, Injectable } from '@nestjs/common';
import { Company, CompanyModel } from './schema/company.schema';
import { CompanyDTO } from './dto/company.dto';
import { MemberModel } from 'src/members/schema/member.schema';
import { Types } from 'mongoose';

@Injectable()
export class CompanyService {
  constructor(
    @Inject('COMPANY_MODEL') private readonly companyModel: CompanyModel,
    @Inject('MEMBER_MODEL') private readonly memberModel: MemberModel,
  ) {}
  async getAll(): Promise<Company[]> {
    return this.companyModel.find().populate('members').exec();
  }

  async create(data: CompanyDTO) {
    return await this.companyModel.create(data);
  }

  async addMemberToCompany({
    companyId,
    memberId,
  }: {
    companyId: string;
    memberId: string;
  }): Promise<void> {
    const company = await this.companyModel.findById(companyId);
    const member = await this.memberModel.findById(memberId);

    if (!company || !member) {
      throw new Error('Data error, memberId or CompanyId are not ok.');
    }
    if (company && member) {
      company.members.push(member);
      await company.save();

      member.companies.push(company);
      await member.save();
    }
  }
}
