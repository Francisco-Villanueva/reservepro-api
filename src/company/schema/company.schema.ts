import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Document,
  SchemaTimestampsConfig,
  Model,
  Types,
  Schema as MongooseSchema,
} from 'mongoose';
import { IWorkhour } from 'src/common/workhours';
import { Category } from '../interfaces/categeory.interface';
import { Location } from '../interfaces/location.interface';

@Schema({ timestamps: true })
export class Company extends Document {
  _id?: Types.ObjectId;
  @Prop({ type: String, required: true })
  name: string;
  @Prop({ type: Object, required: true })
  address: Location;
  @Prop({ type: Array, required: true, max: 3 })
  category: Category[];
  @Prop({ type: Array, default: [] })
  workhours: IWorkhour[];
  @Prop({ type: Boolean, default: true })
  status: boolean;
  @Prop({ type: String, required: false })
  email: string;
  @Prop({ type: String, required: false })
  tenantName: string;
  @Prop({ type: String, required: false })
  image?: string;
  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Service' }],
    default: [],
  })
  services: Types.ObjectId[];
  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Member' }],
    default: [],
  })
  members: Types.ObjectId[];
}

export const CompanySchema = SchemaFactory.createForClass(Company);
export type CompanyDocument = Company & Document & SchemaTimestampsConfig;
export interface CompanyModel extends Model<CompanyDocument> {}
