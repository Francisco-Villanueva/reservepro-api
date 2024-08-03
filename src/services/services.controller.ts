import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import {
  AddToCompanyServicesDto,
  CreateServicesDto,
  UpdateServicesDto,
} from './dto/services.dto';
import { CompanyService } from 'src/company/company.service';
import { Company } from 'src/company/schema/company.schema';
@Controller('services')
export class ServicesController {
  constructor(
    private readonly serviceServices: ServicesService,
    private readonly companyService: CompanyService,
  ) {}

  @Get()
  async getAll() {
    try {
      return this.serviceServices.getAll();
    } catch (error) {
      return error;
    }
  }

  @Get()
  async getByIde() {
    try {
      return this.serviceServices.getAll();
    } catch (error) {
      return error;
    }
  }
  @Post()
  async create(@Body() data: CreateServicesDto) {
    try {
      const existTitle = await this.serviceServices.getByTitle(data.title);
      if (existTitle) {
        throw new UnauthorizedException(
          `Ya existe una servicio llamado '${data.title}'`,
        );
      }

      return await this.serviceServices.create(data);
    } catch (error) {
      throw new UnauthorizedException(error.response.message);
    }
  }
  @Post('/add-to-company')
  async addToCompany(@Body() data: AddToCompanyServicesDto) {
    try {
      let company: Company;
      if (data.companyId) {
        company = await this.companyService.getById(data.companyId);
        if (!company) {
          throw new UnauthorizedException(
            `No existe la sucursal seleccionada.`,
          );
        }
      }
      const service = await this.serviceServices.getById(data.serviceId);
      if (!service) {
        throw new UnauthorizedException(`No existe el serivcio.`);
      }

      await this.companyService.addServiceToCompany({
        company,
        service,
      });

      return service;
    } catch (error) {
      throw new UnauthorizedException(error.response.message);
    }
  }
  @Patch('/update/:id')
  async update(@Param('id') id: string, @Body() data: UpdateServicesDto) {
    try {
      return this.serviceServices.update(id, data);
    } catch (error) {
      return error;
    }
  }
  @Delete('/delete/:id')
  async delete(@Param('id') id: string) {
    try {
      return this.serviceServices.delete(id);
    } catch (error) {
      return error;
    }
  }
}
