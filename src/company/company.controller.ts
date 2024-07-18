import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyDTO } from './dto/company.dto';
import { MembersService } from 'src/members/members.service';

@Controller('company')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly memberService: MembersService,
  ) {}
  @Get()
  async getAll() {
    try {
      return await this.companyService.getAll();
    } catch (error) {
      return error;
    }
  }
  @Post()
  async create(@Body() data: CompanyDTO) {
    try {
      return await this.companyService.create(data);
    } catch (error) {
      return error;
    }
  }
  @Post('/add-member')
  async addMember(
    @Body() { companyId, memberId }: { companyId: string; memberId: string },
  ) {
    try {
      const company = await this.companyService.getById(companyId);
      if (!company) {
        throw new UnauthorizedException('Company not found!');
      }
      const member = await this.memberService.getById(memberId);
      if (!member) {
        throw new UnauthorizedException('Member not found!');
      }
      await this.companyService.addMemberToCompany({
        company,
        member,
      });

      return {
        msg: 'Member added to company succesfully',
        member,
        company,
      };
    } catch (error) {
      return error;
    }
  }
}
