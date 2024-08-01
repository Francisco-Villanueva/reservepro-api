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
import { CreateServicesDto, UpdateServicesDto } from './dto/services.dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly serviceServices: ServicesService) {}

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
      return this.serviceServices.create(data);
    } catch (error) {
      return error;
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
