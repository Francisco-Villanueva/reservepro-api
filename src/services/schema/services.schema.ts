import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { genSalt, hash } from 'bcrypt';
import mongoose, {
  Document,
  SchemaTimestampsConfig,
  Model,
  Types,
} from 'mongoose';
import { IWorkhour } from 'src/common/workhours';
import { Role } from 'src/constants/roles';
@Schema({ timestamps: true })
export class Service extends Document {
  _id?: mongoose.Schema.Types.ObjectId;
  @Prop({ type: String, required: true })
  name: string;
  @Prop({ type: String, required: true })
  lastName: string;
  @Prop({ type: String, required: true })
  email: string;
  @Prop({ type: String, required: true })
  role: Role;
  @Prop({ type: String })
  image?: string;
  @Prop({ type: String, required: false })
  password: string;
  @Prop({ type: String, required: false })
  salt: string;
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Company' }], default: [] })
  companies: mongoose.Schema.Types.ObjectId[];
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Appointment' }], default: [] })
  appointments: mongoose.Schema.Types.ObjectId[];
  @Prop({ type: Array, default: [] })
  workhours: IWorkhour[];
}
export const ServiceSchema = SchemaFactory.createForClass(Service);

export type ServiceDocument = Service & Document & SchemaTimestampsConfig;
export interface ServiceModel extends Model<ServiceDocument> {}
