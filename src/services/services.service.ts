import { Inject, Injectable } from '@nestjs/common';
import {
  CLIENT_SERVICE_MODEL,
  SERVICE_MODEL,
} from 'src/common/providers/constants';
import { Service, ServiceModel } from './schema/services.schema';
import { ICreateService, IUpdateService } from './schema/service.zod';

@Injectable()
export class ServicesService {
  constructor(
    @Inject(SERVICE_MODEL) private readonly serviceModel: ServiceModel,
    @Inject(CLIENT_SERVICE_MODEL)
    private readonly clientServiceModel: ServiceModel,
  ) {}

  private async getClientService(originalService: Service) {
    return await this.clientServiceModel.findOne({
      title: originalService.title,
    });
  }
  async getAll() {
    return await this.serviceModel.find();
  }
  async getByTitle(title: string) {
    return await this.serviceModel.findOne({ title });
  }
  async getById(id: string) {
    return await this.serviceModel.findById(id);
  }
  async create(data: ICreateService) {
    await this.clientServiceModel.create(data);
    return await this.serviceModel.create(data);
  }
  async update(id: string, data: IUpdateService) {
    const service = await this.getById(id);
    const clientService = await this.getClientService(service);
    await clientService.updateOne(data);
    return await service.updateOne(data);
  }
  async delete(id: string) {
    const service = await this.getById(id);
    const clientService = await this.getClientService(service);
    await this.clientServiceModel.deleteOne({ _id: clientService._id });
    return await this.serviceModel.deleteOne({ _id: service._id });
  }
}
