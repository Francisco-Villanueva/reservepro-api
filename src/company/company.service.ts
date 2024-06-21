import { Inject, Injectable } from '@nestjs/common';
import { Company } from './schema/company.schema';
import { Model, SchemaTimestampsConfig, Document } from 'mongoose';
export type CompanyDocument = Company & Document & SchemaTimestampsConfig;

export interface CompanyModel extends Model<CompanyDocument> {}

@Injectable()
export class CompanyService {
  constructor(
    @Inject('COMPANY_MODEL') private readonly companyModel: CompanyModel,
  ) {}
  async getAll(): Promise<Company[]> {
    return this.companyModel.find();
  }
}
