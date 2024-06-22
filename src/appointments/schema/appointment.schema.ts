import { Document, SchemaTimestampsConfig, Model } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Appointment extends Document {
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
  memberId: string;
  @Prop({ type: String, required: true })
  phone: string;
  @Prop({ type: String, required: true })
  service: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);

type AppointmentDocument = Appointment & Document & SchemaTimestampsConfig;

export interface AppointmentModel extends Model<AppointmentDocument> {}
