import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, {
  Document,
  SchemaTimestampsConfig,
  Model,
  Types,
} from 'mongoose';
import { Appointment } from 'src/appointments/schema/appointment.schema';
@Schema({ timestamps: true })
export class Customer extends Document {
  _id?: mongoose.Schema.Types.ObjectId;
  @Prop({ type: String, required: true })
  firstName: string;
  @Prop({ type: String, required: true })
  lastName: string;
  @Prop({ type: String, required: true })
  email: string;
  @Prop({ type: String, required: true })
  phone: string;
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Appointment' }], default: [] })
  apointments: Appointment[];
}
export const CustomerSchema = SchemaFactory.createForClass(Customer);
export type CustomerDocument = Customer & Document & SchemaTimestampsConfig;
export interface CustomerModel extends Model<CustomerDocument> {}
