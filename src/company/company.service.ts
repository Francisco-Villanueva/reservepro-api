import { Inject, Injectable } from '@nestjs/common';
import { Company, CompanyModel } from './schema/company.schema';
import { CompanyDTO } from './dto/company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @Inject('COMPANY_MODEL') private readonly companyModel: CompanyModel,
  ) {}
  async getAll(): Promise<Company[]> {
    return this.companyModel.find();
  }

  async create(data: CompanyDTO) {
    return this.companyModel.create(data);
  }
}
