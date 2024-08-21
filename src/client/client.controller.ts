import { Controller, Get, Param, Query } from '@nestjs/common';
import { ClientService } from './client.service';

@Controller('client')
export class ClientController {
  constructor(private readonly clientServices: ClientService) {}

  @Get('/companies')
  async getCompanies(
    @Query() query: { name: string; category: string; city: string },
  ) {
    try {
      return this.clientServices.getCompanies(
        query.name,
        query.category,
        query.city.split(',')[0],
      );
    } catch (error) {
      return error;
    }
  }
  @Get('/companies/:id')
  async getCompanyById(@Param() { id }: { id: string }) {
    try {
      return this.clientServices.getCompanyById(id);
    } catch (error) {
      return error;
    }
  }
  @Get('/services/:id')
  async getServceById(@Param() { id }: { id: string }) {
    try {
      return this.clientServices.getServiceById(id);
    } catch (error) {
      return error;
    }
  }
  @Get('/members/:id')
  async getMemberById(@Param() { id }: { id: string }) {
    try {
      return this.clientServices.getMemberById(id);
    } catch (error) {
      return error;
    }
  }
  @Get('/companies/:id/services')
  async getCompanyServices(@Param() { id }: { id: string }) {
    try {
      return this.clientServices.getServicesFromCompany(id);
    } catch (error) {
      return error;
    }
  }
  @Get('/companies/:id/members')
  async getCompanyMembers(@Param() { id }: { id: string }) {
    try {
      return this.clientServices.getMembersFromCompany(id);
    } catch (error) {
      return error;
    }
  }
  @Get('/services/:id/members')
  async getServicesMembers(@Param() { id }: { id: string }) {
    try {
      return this.clientServices.getMembersFromServices(id);
    } catch (error) {
      return error;
    }
  }
}
