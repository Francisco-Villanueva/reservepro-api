import { Body, Controller, Get, Post } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyDTO } from './dto/company.dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}
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
}
