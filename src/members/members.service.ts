import { Inject, Injectable } from '@nestjs/common';
import { Member, MemberModel } from './schema/member.schema';
import { MemberDto } from './dto/member.dto';

@Injectable()
export class MembersService {
  constructor(
    @Inject('MEMBER_MODEL') private readonly memberModel: MemberModel,
  ) {}

  async getAll(): Promise<Member[]> {
    return this.memberModel.find();
  }
  async create(data: MemberDto): Promise<Member> {
    return this.memberModel.create(data);
  }
}
