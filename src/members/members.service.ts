import { Inject, Injectable } from '@nestjs/common';
import { Member, MemberModel } from './schema/member.schema';
import { MemberDto, UpdateMemberDto } from './dto/member.dto';
import {
  CLIENT_MEMBER_MODEL,
  MEMBER_MODEL,
} from 'src/common/providers/constants';

@Injectable()
export class MembersService {
  constructor(
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
    const originMember = await this.memberModel.findById(id);
    const clientMember = await this.getClientMember(originMember);
    await this.clientMemberModel.findByIdAndUpdate(clientMember.id, data, {
      new: true,
    });
    return this.memberModel.findByIdAndUpdate(id, data, { new: true });
  }
  async delete(id: string) {
    const originMember = await this.memberModel.findById(id);
    const clientMember = await this.getClientMember(originMember);
    await this.clientMemberModel.deleteOne({ _id: clientMember._id });
    return this.memberModel.deleteOne({ _id: id });
  }
}
