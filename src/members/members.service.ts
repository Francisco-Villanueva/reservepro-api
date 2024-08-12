import { Inject, Injectable } from '@nestjs/common';
import { Member, MemberModel } from './schema/member.schema';
import { MemberDto, UpdateMemberDto } from './dto/member.dto';
import {
  CLIENT_MEMBER_MODEL,
  COMPANY_MODEL,
  MEMBER_MODEL,
} from 'src/common/providers/constants';
import { CompanyModel } from 'src/company/schema/company.schema';

@Injectable()
export class MembersService {
  constructor(
    @Inject(COMPANY_MODEL) private readonly companyModel: CompanyModel,
    @Inject(MEMBER_MODEL) private readonly memberModel: MemberModel,
    @Inject(CLIENT_MEMBER_MODEL)
    private readonly clientMemberModel: MemberModel,
  ) {}

  private async getClientMember(originMember: Member) {
    return await this.clientMemberModel.findOne({
      email: originMember.email,
    });
  }
  async getAll(): Promise<Member[]> {
    return this.memberModel.find();
  }
  async getFree(): Promise<Member[]> {
    return this.memberModel.find({ companies: [] });
  }
  async count(): Promise<number> {
    return this.memberModel.countDocuments();
  }
  async getById(id: string): Promise<Member> {
    return this.memberModel.findById({ _id: id });
  }
  async create(data: MemberDto): Promise<Member> {
    await this.clientMemberModel.create(data);
    return this.memberModel.create(data);
  }
  async update(id: string, data: UpdateMemberDto): Promise<Member> {
    // Actualiza el Member en la base de datos
    const originMember = await this.memberModel.findByIdAndUpdate(id, data, {
      new: true,
    });

    // Actualiza el Member en la base de datos de cliente
    const clientMember = await this.getClientMember(originMember);
    await this.clientMemberModel.findByIdAndUpdate(clientMember.id, data, {
      new: true,
    });

    // Sincroniza las compañías relacionadas con este miembro
    const companies = await this.companyModel.find({ members: id });

    console.log('list de compnies,', companies);
    for (const company of companies) {
      // Actualiza cada compañía que tenga a este miembro en su lista
      await this.companyModel.updateOne(
        { _id: company._id, 'members._id': id },
        { $set: { 'members.$': originMember } },
      );
    }

    return originMember;
  }
  async delete(id: string) {
    const originMember = await this.memberModel.findById(id);
    const clientMember = await this.getClientMember(originMember);
    await this.clientMemberModel.deleteOne({ _id: clientMember._id });
    return this.memberModel.deleteOne({ _id: id });
  }
}
