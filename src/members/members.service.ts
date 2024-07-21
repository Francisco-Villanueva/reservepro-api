import { Inject, Injectable } from '@nestjs/common';
import { Member, MemberModel } from './schema/member.schema';
import { MemberDto, UpdateMemberDto } from './dto/member.dto';

@Injectable()
export class MembersService {
  constructor(
    @Inject('MEMBER_MODEL') private readonly memberModel: MemberModel,
  ) {}

  async getAll(): Promise<Member[]> {
    return this.memberModel.find();
  }
  async getById(id: string): Promise<Member> {
    return this.memberModel.findById({ _id: id });
  }
  async create(data: MemberDto): Promise<Member> {
    return this.memberModel.create(data);
  }
  async update(id: string, data: UpdateMemberDto): Promise<Member> {
    return this.memberModel.findByIdAndUpdate(id, data, { new: true });
  }
  async delete(id: string) {
    return this.memberModel.deleteOne({ _id: id });
  }
}
