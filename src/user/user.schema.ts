import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, type: String })
  email: string;
  @Prop({ required: false, type: String })
  password: string;
  @Prop({ required: true, unique: true, type: String })
  username: string;
  @Prop({ required: false, type: String })
  bio: string;
  @Prop({ required: false, type: String })
  cover: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
