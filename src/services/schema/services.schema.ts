import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, {
  Document,
  SchemaTimestampsConfig,
  Model,
  Types,
} from 'mongoose';
import { Provision } from '../interfaces/provision.interface';
@Schema({ timestamps: true })
export class Service extends Document {
  _id?: mongoose.Schema.Types.ObjectId;
  @Prop({ type: String, required: true })
  title: string;
  @Prop({ type: Number, required: true })
  duration: number;
  @Prop({ type: Number, required: true })
  price: number;
  @Prop({ type: String })
  provision: Provision;
  @Prop({ type: String, required: false })
  description: string;
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Member' }], default: [] })
  members: mongoose.Schema.Types.ObjectId[];
}
export const ServiceSchema = SchemaFactory.createForClass(Service);

export type ServiceDocument = Service & Document & SchemaTimestampsConfig;
export interface ServiceModel extends Model<ServiceDocument> {}
