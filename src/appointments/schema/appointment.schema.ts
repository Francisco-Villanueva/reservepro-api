import mongoose, {
  Document,
  SchemaTimestampsConfig,
  Model,
  Types,
} from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Appointment extends Document {
  _id?: mongoose.Schema.Types.ObjectId;
  @Prop({ type: String, required: true })
  name: string;
  @Prop({ type: String, required: true })
  lastName: string;
  @Prop({ type: String, required: true })
  email: string;
  @Prop({ type: String, required: true })
  time: string;
  @Prop({ type: String, required: true })
  date: string;
  @Prop({ type: String, required: true })
  phone: string;
  @Prop({ type: String, required: true })
  service: string;
  @Prop({ type: Boolean, default: false })
  canceled: boolean;
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  memberId: mongoose.Schema.Types.ObjectId;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);

type AppointmentDocument = Appointment & Document & SchemaTimestampsConfig;

export interface AppointmentModel extends Model<AppointmentDocument> {}
