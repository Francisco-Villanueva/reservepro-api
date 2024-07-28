import { Inject, Injectable } from '@nestjs/common';
import { Company, CompanyModel } from './schema/company.schema';
import { CompanyDTO, UpdateCompanyDTO } from './dto/company.dto';
import { Member, MemberModel } from 'src/members/schema/member.schema';
@Injectable()
export class CompanyService {
  constructor(
    @Inject('COMPANY_MODEL') private readonly companyModel: CompanyModel,
    @Inject('MEMBER_MODEL') private readonly memberModel: MemberModel,
  ) {}
  async getAll(): Promise<Company[]> {
    return this.companyModel.find().populate('members').exec();
  }
  async getById(_id: string): Promise<Company> {
    return this.companyModel.findById({ _id });
  }

  async create(data: CompanyDTO) {
    return await this.companyModel.create(data);
  }
  async update(id: string, data: UpdateCompanyDTO) {
    return await this.companyModel.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  async addMemberToCompany({
    company,
    member,
  }: {
    company: Company;
    member: Member;
  }): Promise<void> {
    company.members.push(member);
    await company.save();

    if (!member.workhours.length) {
      member.workhours = company.workhours;
      await member.save();
    }
    member.companies.push(company._id);
    await member.save();
  }

  async count() {
    return this.companyModel.countDocuments();
  }
}
