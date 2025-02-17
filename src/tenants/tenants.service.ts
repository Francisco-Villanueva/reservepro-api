import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Tenant } from './schemas/tenant.schema';
import { CreateTenantDto, UpdateTenantDto } from './dto';
import { CreateTenantByProvidersDto } from './dto/create-tenant-by-providers.dto';

@Injectable()
export class TenantsService {
  constructor(
    @InjectModel(Tenant.name)
    private tenantRepository: Model<Tenant>,
  ) {}

  async create(createTenantDto: CreateTenantDto) {
    const user = await this.findByEmail(createTenantDto.email);

    if (user) {
      throw new BadRequestException('This mail is already in use');
    }

    const data: CreateTenantDto = {
      ...createTenantDto,
      tenantName: createTenantDto.tenantName
        ? createTenantDto.tenantName
        : createTenantDto.companyName
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(''),
    };

    return await this.tenantRepository.create(data);
  }

  async createByProviders(
    createTenantByProvidersDto: CreateTenantByProvidersDto,
  ) {
    const user = await this.findByEmail(createTenantByProvidersDto.email);

    if (user) {
      user.name = createTenantByProvidersDto.name;
      user.image = createTenantByProvidersDto.image;

      await user.save();
      return user;
    }

    await this.tenantRepository.create(createTenantByProvidersDto);
  }

  async getByTenantName(tenantName: string) {
    return await this.tenantRepository.findOne({ tenantName });
  }

  async findByEmail(email: string) {
    return await this.tenantRepository.findOne({ email });
  }

  async update(userId: ObjectId, updateTenantDto: UpdateTenantDto) {
    return this.tenantRepository.findByIdAndUpdate(userId, updateTenantDto);
  }
  async delete(email: string) {
    return this.tenantRepository.findOneAndDelete({ email });
  }
}
