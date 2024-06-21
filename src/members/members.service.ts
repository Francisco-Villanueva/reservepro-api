import { Inject, Injectable } from '@nestjs/common';
import { Member, MemberModel } from './schema/member.schema';

@Injectable()
export class MembersService {
  constructor(
    @Inject('MEMBER_MODEL') private readonly memberModel: MemberModel,
  ) {}

  async getAll(): Promise<Member[]> {
    return this.memberModel.find();
  }
}
