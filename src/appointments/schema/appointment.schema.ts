import { Document, SchemaTimestampsConfig, Model, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Member } from 'src/members/schema/member.schema';

@Schema({ timestamps: true })
export class Appointment extends Document {
  _id?: Types.ObjectId;
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
  @Prop({ type: Member })
  member: Partial<Member>;
  @Prop({ type: String })
  memberId: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);

type AppointmentDocument = Appointment & Document & SchemaTimestampsConfig;

export interface AppointmentModel extends Model<AppointmentDocument> {}
