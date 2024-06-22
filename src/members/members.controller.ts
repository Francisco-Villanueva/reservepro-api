import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { MemberDto } from './dto/member.dto';
import { TenantsService } from 'src/tenants/tenants.service';
import { JwtService } from '@nestjs/jwt';
import { CompanyService } from 'src/company/company.service';
@Controller('members')
export class MembersController {
  constructor(
    private readonly memberService: MembersService,
    private readonly tenantService: TenantsService,
    private readonly jwtService: JwtService,
    private readonly companyService: CompanyService,
  ) {}
  private async getTenantName(@Request() request): Promise<string> {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWTSECRETKEY,
    });

    const { tenantName } = payload;
    return tenantName;
  }
  @Get()
  async getAll() {
    try {
      return await this.memberService.getAll();
    } catch (error) {
      return error;
    }
  }

  @Post()
  async create(@Body() data: MemberDto, @Request() req: Request) {
    try {
      const tenantName = await this.getTenantName(req);
      if (!tenantName) {
        throw new UnauthorizedException();
      }
      const newTenant = await this.tenantService.create({
        ...data,
        tenantName,
      });
      if (!newTenant) {
        throw new UnauthorizedException();
      }

      const newMember = await this.memberService.create(data);
      if (!newMember) {
        throw new UnauthorizedException();
      }

      return newMember;
    } catch (error) {
      return error;
    }
  }
}
