import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { genSalt, hash } from 'bcrypt';
import { Document, SchemaTimestampsConfig, Model } from 'mongoose';
@Schema({ timestamps: true })
export class Member extends Document {
  @Prop({ type: String, required: true })
  name: string;
  @Prop({ type: String, required: true })
  lastName: string;
  @Prop({ type: String, required: true })
  email: string;
  @Prop({ type: String })
  image?: string;
  @Prop({ type: String, required: false })
  password: string;
  @Prop({ type: String, required: false })
  salt: string;
}
export const MemberSchema = SchemaFactory.createForClass(Member);

MemberSchema.pre('save', async function (next) {
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

export type MemberDocument = Company & Document & SchemaTimestampsConfig;
export interface MemberModel extends Model<MemberDocument> {}
