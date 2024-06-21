import { Controller, Get } from '@nestjs/common';
import { MembersService } from './members.service';

@Controller('members')
export class MembersController {
  constructor(private readonly memberService: MembersService) {}

  @Get()
  async getAll() {
    try {
      return await this.memberService.getAll();
    } catch (error) {
      return error;
    }
  }
}
