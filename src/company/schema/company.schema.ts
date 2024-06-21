import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema({ timestamps: true })
export class Company extends Document {
  @Prop({ type: String, default: '' })
  tenantName: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String })
  image?: string;

  @Prop({ type: String, required: false })
  password: string;

  @Prop({ type: String, required: false })
  salt: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
