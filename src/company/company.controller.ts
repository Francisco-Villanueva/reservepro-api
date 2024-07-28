import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import {
  CompanyDTO,
  CreateCompanyDTO,
  UpdateCompanyDTO,
} from './dto/company.dto';
import { MembersService } from 'src/members/members.service';
import { GeocodeService } from 'src/geocode/geocode.services';
import { Location } from './interfaces/location.interface';
import { ICompany } from './schema/company.zod';

@Controller('company')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly memberService: MembersService,
    private readonly geocodeService: GeocodeService,
  ) {}
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
      return await this.companyService.getById(id);
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
  async create(@Body() data: CreateCompanyDTO) {
    try {
      const { address } = data;
      const locationData = await this.geocodeService.geocodeAddress(address);

      const formatedAddress = {
        lat: locationData.lat,
        lng: locationData.lng,
        value: address,
      };

      return await this.companyService.create({
        ...data,
        address: formatedAddress,
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
}
