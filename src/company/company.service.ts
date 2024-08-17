import { Inject, Injectable } from '@nestjs/common';
import { Company, CompanyModel } from './schema/company.schema';
import { CompanyDTO, UpdateCompanyDTO } from './dto/company.dto';
import { Member, MemberModel } from 'src/members/schema/member.schema';
import {
  CLIENT_COMPANY_MODEL,
  CLIENT_MEMBER_MODEL,
  CLIENT_SERVICE_MODEL,
  COMPANY_MODEL,
  MEMBER_MODEL,
  SERVICE_MODEL,
} from 'src/common/providers/constants';
import { Service, ServiceModel } from 'src/services/schema/services.schema';

@Injectable()
export class CompanyService {
  constructor(
    @Inject(COMPANY_MODEL) private readonly companyModel: CompanyModel,
    @Inject(MEMBER_MODEL) private readonly memberModel: MemberModel,
    @Inject(SERVICE_MODEL) private readonly serviceModel: ServiceModel,
    @Inject(CLIENT_COMPANY_MODEL)
    private readonly clientCompanyModel: CompanyModel,
    @Inject(CLIENT_MEMBER_MODEL)
    private readonly clientMemberModel: MemberModel,
    @Inject(CLIENT_SERVICE_MODEL)
    private readonly clientServiceModel: ServiceModel,
  ) {}

  private async getClientService(originService: Service) {
    return await this.clientServiceModel.findOne({
      title: originService.title,
    });
  }
  private async getClientMember(originMember: Member) {
    return await this.clientMemberModel.findOne({
      email: originMember.email,
    });
  }
  private async getClientCompany(originCompany: Company) {
    return await this.clientCompanyModel.findOne({
      tenantName: originCompany.tenantName,
      name: originCompany.name,
    });
  }

  async getAll(): Promise<Company[]> {
    return this.companyModel.find();
  }
  async getById(_id: string): Promise<Company> {
    return this.companyModel.findById({ _id });
  }
  async getMembers(_id: string): Promise<unknown[]> {
    const res = await this.companyModel.findById({ _id }).populate('members');

    return res.members;
  }
  async getServices(_id: string): Promise<unknown[]> {
    const res = await this.companyModel.findById({ _id });

    const servicesPromises = res.services.map(
      async (serviceId) => await this.serviceModel.findById(serviceId),
    );
    return await Promise.all(servicesPromises);
  }

  async create(data: CompanyDTO) {
    await this.clientCompanyModel.create(data);
    return await this.companyModel.create(data);
  }
  async delete(id: string) {
    const originCompany = await this.companyModel.findById(id);
    const clientCompany = await this.getClientCompany(originCompany);
    await this.clientCompanyModel.deleteOne({ _id: clientCompany._id });
    return await this.companyModel.deleteOne({ _id: originCompany._id });
  }
  async update(id: string, data: UpdateCompanyDTO) {
    const originCompany = await this.companyModel.findById(id);

    await this.clientCompanyModel.findOneAndUpdate(
      {
        tenantName: originCompany.tenantName,
        name: originCompany.name,
      },
      data,
      { new: true },
    );

    return await this.companyModel.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  async addMemberToCompany({
    company,
    member,
  }: {
    company: Company;
    member: Member;
  }): Promise<void> {
    if (!company.members.includes(member._id)) {
      company.members.push(member._id);
      await company.save();
    }

    if (!member.companies.includes(company._id)) {
      member.companies.push(company._id);
      if (!member.workhours.length) {
        member.workhours = company.workhours;
      }
      await member.save();
    }

    // Client logic
    const clientCompany = await this.getClientCompany(company);
    const clientMember = await this.getClientMember(member);

    if (clientCompany && clientMember) {
      if (!clientCompany.members.includes(clientMember._id)) {
        clientCompany.members.push(clientMember._id);
        await clientCompany.save();
      }

      if (!clientMember.companies.includes(clientCompany._id)) {
        clientMember.companies.push(clientCompany._id);
        if (!clientMember.workhours.length) {
          clientMember.workhours = clientCompany.workhours;
        }
        await clientMember.save();
      }
    }
  }

  async removeMemberFromCompany({
    company,
    member,
  }: {
    company: Company;
    member: Member;
  }): Promise<void> {
    // Elimina la referencia del miembro en la compañía
    company.members = company.members.filter((m) => m !== member._id);
    await company.save();

    // Elimina la referencia de la compañía en el miembro
    member.companies = member.companies.filter((c) => c !== company._id);
    await member.save();

    // Client logic
    const clientCompany = await this.getClientCompany(company);
    const clientMember = await this.getClientMember(member);

    if (clientCompany && clientMember) {
      clientCompany.members = clientCompany.members.filter(
        (m) => m !== clientMember._id,
      );
      await clientCompany.save();

      clientMember.companies = clientMember.companies.filter(
        (c) => c !== clientCompany._id,
      );
      await clientMember.save();
    }
  }

  async addServiceToCompany({
    company,
    service,
  }: {
    company: Company;
    service: Service;
  }): Promise<void> {
    // Verifica si el servicio ya está asociado con la compañía para evitar duplicados
    if (!company.services.includes(service._id)) {
      company.services.push(service._id);
      await company.save();
    }

    // Verifica si la compañía ya está asociada con el servicio para evitar duplicados
    if (!service.companies.includes(company._id)) {
      service.companies.push(company._id);
      await service.save();
    }

    // Client logic
    const clientCompany = await this.getClientCompany(company);
    const clientService = await this.getClientService(service);

    if (clientCompany && clientService) {
      if (!clientCompany.services.includes(clientService._id)) {
        clientCompany.services.push(clientService._id);
        await clientCompany.save();
      }

      if (!clientService.companies.includes(clientCompany._id)) {
        clientService.companies.push(clientCompany._id);
        await clientService.save();
      }
    }
  }

  async removeServiceFromCompany({
    company,
    service,
  }: {
    company: Company;
    service: Service;
  }): Promise<void> {
    // Elimina la referencia del servicio en la compañía
    company.services = company.services.filter(
      (s) => String(s) !== String(service._id),
    );
    await company.save();

    // Elimina la referencia de la compañía en el servicio
    service.companies = service.companies.filter(
      (c) => String(c) !== String(company._id),
    );
    await service.save();

    // Client logic
    const clientCompany = await this.getClientCompany(company);
    const clientService = await this.getClientService(service);

    if (clientCompany && clientService) {
      clientCompany.services = clientCompany.services.filter(
        (s) => String(s) !== String(clientService._id),
      );
      await clientCompany.save();

      clientService.companies = clientService.companies.filter(
        (c) => String(c) !== String(clientCompany._id),
      );
      await clientService.save();
    }
  }

  async count() {
    return this.companyModel.countDocuments();
  }
}
