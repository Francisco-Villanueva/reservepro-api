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
} from 'src/common/providers/constants';
import { Service, ServiceModel } from 'src/services/schema/services.schema';
import { equal } from 'assert';
@Injectable()
export class CompanyService {
  constructor(
    @Inject(COMPANY_MODEL) private readonly companyModel: CompanyModel,
    @Inject(MEMBER_MODEL) private readonly memberModel: MemberModel,
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
    return this.companyModel.find().populate('members').exec();
  }
  async getById(_id: string): Promise<Company> {
    return this.companyModel.findById({ _id });
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
    const clientCompany = await this.getClientCompany(company);
    const clientMember = await this.getClientMember(member);
    company.members.push(member);
    await company.save();
    clientCompany.members.push(clientMember);
    await clientCompany.save();

    if (!member.workhours.length) {
      member.workhours = company.workhours;
      await member.save();
    }
    member.companies.push(company._id);
    await member.save();

    //ADD COMPANY TO MEMBER, AT CLIENT CONNECTION.
    if (!clientMember.workhours.length) {
      clientMember.workhours = clientCompany.workhours;
      await clientMember.save();
    }
    clientMember.companies.push(clientCompany._id);
    await clientMember.save();
  }
  async removeMemberFromCompany({
    company,
    member,
  }: {
    company: Company;
    member: Member;
  }): Promise<void> {
    const clientCompany = await this.getClientCompany(company);
    const clientMember = await this.getClientMember(member);

    company.members = company.members.filter(
      (s) => String(s._id) !== String(member._id),
    );
    await company.save();
    clientCompany.members = clientCompany.members.filter(
      (s) => String(s._id) !== String(clientMember._id),
    );
    await clientCompany.save();

    member.companies = member.companies.filter(
      (s) => String(s) !== String(company._id),
    );
    await member.save();

    clientMember.companies = clientMember.companies.filter(
      (s) => String(s) !== String(clientCompany._id),
    );

    await clientMember.save();
  }

  async addServiceToCompany({
    company,
    service,
  }: {
    company: Company;
    service: Service;
  }): Promise<void> {
    const clientCompany = await this.getClientCompany(company);
    const clientService = await this.getClientService(service);

    company.services.push(service);
    await company.save();
    clientCompany.services.push(clientService);
    await clientCompany.save();

    service.companies.push(company._id);
    await service.save();
    clientService.companies.push(clientCompany._id);
    await clientService.save();
  }
  async removeServiceFromCompany({
    company,
    service,
  }: {
    company: Company;
    service: Service;
  }): Promise<void> {
    const clientCompany = await this.getClientCompany(company);
    const clientService = await this.getClientService(service);

    company.services = company.services.filter(
      (s) => String(s._id) !== String(service._id),
    );

    await company.save();
    clientCompany.services = clientCompany.services.filter(
      (s) => String(s._id) !== String(clientService._id),
    );
    await clientCompany.save();

    service.companies = service.companies.filter(
      (c) => String(c) !== String(company._id),
    );
    await service.save();
    clientService.companies = clientService.companies.filter(
      (c) => String(c) !== String(clientCompany._id),
    );
    await clientService.save();
  }

  async count() {
    return this.companyModel.countDocuments();
  }
}
