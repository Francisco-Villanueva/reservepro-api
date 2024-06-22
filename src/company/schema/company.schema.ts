import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTimestampsConfig, Model, Types } from 'mongoose';
import { Member } from 'src/members/schema/member.schema';

@Schema({ timestamps: true })
export class Company extends Document {
  @Prop({ type: String, required: true })
  name: string;
  @Prop({ type: String, required: true })
  address: string;
  @Prop({ type: String, required: false })
  email: string;
  @Prop({ type: Array, required: true })
  category: string[];
  @Prop({ type: Array, required: true })
  services: string[];
  @Prop({ type: String, required: true })
  coin: string;
  @Prop({ type: Boolean, default: true })
  status: boolean;
  @Prop({ type: String, required: false })
  image?: string;
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Member' }], default: [] })
  members: Member[];
}

export const CompanySchema = SchemaFactory.createForClass(Company);
export type CompanyDocument = Company & Document & SchemaTimestampsConfig;
export interface CompanyModel extends Model<CompanyDocument> {}
