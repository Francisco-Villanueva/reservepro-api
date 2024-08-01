import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { MemberDto, UpdateMemberDto } from './dto/member.dto';
import { TenantsService } from 'src/tenants/tenants.service';
import { JwtService } from '@nestjs/jwt';
@Controller('members')
export class MembersController {
  constructor(
    private readonly memberService: MembersService,
    private readonly tenantService: TenantsService,
    private readonly jwtService: JwtService,
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
  @Get('/free')
  async getFree() {
    try {
      return await this.memberService.getFree();
    } catch (error) {
      return error;
    }
  }
  @Get('/count')
  async getCount() {
    try {
      return await this.memberService.count();
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

  @Patch('/edit/:id')
  async update(@Param() { id }: { id: string }, @Body() data: UpdateMemberDto) {
    try {
      const updatedMember = await this.memberService.update(id, data);

      return updatedMember;
    } catch (error) {
      return error;
    }
  }
  @Delete(':id')
  async delete(@Param() { id }: { id: string }) {
    try {
      const memberToDelete = await this.memberService.getById(id);
      if (!memberToDelete) {
        throw new UnauthorizedException('Member  noy found.!');
      }

      await this.tenantService.delete(memberToDelete.email);
      const deleted = await this.memberService.delete(id);

      return deleted;
    } catch (error) {
      return error;
    }
  }
}
