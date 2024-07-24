import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { genSalt, hash } from 'bcrypt';
import mongoose, { Document } from 'mongoose';
import { Role } from 'src/constants/roles';
@Schema({ timestamps: true })
export class Tenant extends Document {
  _id?: mongoose.Schema.Types.ObjectId;
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String, required: true })
  userName: string;
  @Prop({ type: String, default: '' })
  tenantName: string;
  @Prop({ type: String, default: '' })
  companyName: string;

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
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);

TenantSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  try {
    const salt = await genSalt(10);

    this.salt = salt;
    this.password = await hash(this.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});
