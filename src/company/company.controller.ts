import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Headers,
  Param,
  Patch,
  Post,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDTO, UpdateCompanyDTO } from './dto/company.dto';
import { MembersService } from 'src/members/members.service';
import { GeocodeService } from 'src/geocode/geocode.services';
import { Request as RequestExp } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Location } from './interfaces/location.interface';
@Controller('company')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly memberService: MembersService,
    private readonly geocodeService: GeocodeService,
    private jwtService: JwtService,
  ) {}
  private async getTenantName(request: RequestExp) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    const tokneRes = type === 'Bearer' ? token : undefined;

    if (!tokneRes) throw new UnauthorizedException();
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWTSECRETKEY,
      });

      return payload.tenantName;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
  @Get()
  async getAll() {
    try {
      return await this.companyService.getAll();
    } catch (error) {
      return error;
    }
  }
  @Get('/count')
  async getCount() {
    try {
      return await this.companyService.count();
    } catch (error) {
      return error;
    }
  }

  @Get('/details/:id')
  async getById(@Param() { id }: { id: string }) {
    try {
      const company = await this.companyService.getById(id);
      if (!company) {
        throw new UnauthorizedException('Sucursal no encontrada.');
      }
      return company;
    } catch (error) {
      return error;
    }
  }
  @Delete('/:id')
  async delete(@Param() { id }: { id: string }) {
    try {
      const res = await this.companyService.delete(id);

      return res;
    } catch (error) {
      return error;
    }
  }

  @Patch('/edit/:id')
  async updateCompany(
    @Param() { id }: { id: string },
    @Body() data: UpdateCompanyDTO,
  ) {
    try {
      return await this.companyService.update(id, data);
    } catch (error) {
      return error;
    }
  }
  @Post()
  async create(@Body() data: CreateCompanyDTO, @Request() req: RequestExp) {
    try {
      const tenantName = await this.getTenantName(req);
      const { address } = data;
      const locationData = await this.geocodeService.geocodeAddress(address);

      const formatedAddress: Location = {
        lat: locationData.lat,
        lng: locationData.lng,
        value: address,
        city: locationData.city,
      };

      return await this.companyService.create({
        ...data,
        address: formatedAddress,
        tenantName,
      });
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
  @Post('/remove-member')
  async removeMember(
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
      await this.companyService.removeMemberFromCompany({
        company,
        member,
      });

      return 'Member removed to company succesfully';
    } catch (error) {
      return error;
    }
  }
}
