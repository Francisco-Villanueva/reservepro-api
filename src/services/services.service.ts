import { Inject, Injectable } from '@nestjs/common';
import {
  CLIENT_MEMBER_MODEL,
  CLIENT_SERVICE_MODEL,
  MEMBER_MODEL,
  SERVICE_MODEL,
} from 'src/common/providers/constants';
import { Service, ServiceModel } from './schema/services.schema';
import { ICreateService, IUpdateService } from './schema/service.zod';
import { MemberModel } from 'src/members/schema/member.schema';

@Injectable()
export class ServicesService {
  constructor(
    @Inject(SERVICE_MODEL) private readonly serviceModel: ServiceModel,
    @Inject(CLIENT_SERVICE_MODEL)
    private readonly clientServiceModel: ServiceModel,
    @Inject(CLIENT_MEMBER_MODEL)
    private readonly clientMemberModel: MemberModel,
    @Inject(MEMBER_MODEL)
    private readonly memberModel: MemberModel,
  ) {}

  private async getClientService(originalService: Service) {
    return await this.clientServiceModel.findOne({
      title: originalService.title,
    });
  }
  async getAll() {
    return await this.serviceModel.find().populate('members').exec();
  }

  async getMembers(_id: string): Promise<unknown[]> {
    const res = await this.serviceModel.findById({ _id });

    const servicesPromises = res.members.map(
      async (serviceId) => await this.memberModel.findById(serviceId),
    );
    return await Promise.all(servicesPromises);
  }
  async getOneMember(serviceId: string, memberId: string) {
    const res = await this.serviceModel.findById(serviceId);

    return res.members.some((id) => id.toString() === memberId);
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

  async addMemberToService(serviceId: string, memberId: string) {
    const service = await this.serviceModel.findById(serviceId);
    if (!service) throw new Error('Service not found!');

    const member = await this.memberModel.findById(memberId);
    if (!member) throw new Error('Member not found!');

    const clientService = await this.getClientService(service);
    if (!clientService) throw new Error('Client service not found!');

    const clientMember = await this.clientMemberModel.findOne({
      email: member.email,
    });
    if (!clientMember) throw new Error('Client member not found!');

    // Verificar si el miembro ya está en el servicio
    const isMemberInService = service.members.some(
      (e) => String(e._id) === String(member._id),
    );

    if (!isMemberInService) {
      // Añadir el miembro al servicio
      service.members.push(member._id);
      await service.save();

      // Añadir el miembro al servicio del cliente
      clientService.members.push(clientMember._id);
      await clientService.save();
    }

    return service;
  }

  async removeMemberFromService(serviceId: string, memberId: string) {
    const service = await this.serviceModel.findById(serviceId);
    if (!service) throw new Error('Service not found!');

    const member = await this.memberModel.findById(memberId);
    if (!member) throw new Error('Member not found!');

    const clientService = await this.getClientService(service);
    if (!clientService) throw new Error('Client service not found!');

    const clientMember = await this.clientMemberModel.findOne({
      email: member.email,
    });
    if (!clientMember) throw new Error('Client member not found!');

    service.members = service.members.filter(
      (e) => e.toString() !== member._id.toString(),
    );
    await service.save();

    clientService.members = clientService.members.filter(
      (e) => e.toString() !== clientMember._id.toString(),
    );
    await clientService.save();

    return service;
  }
}
