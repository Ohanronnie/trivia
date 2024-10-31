import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/user/user.schema';

export interface IQuestions {
  question: string;
  options: Array<string>;
}
export interface ILink {
  type: string;
  url: string;
}
@Schema()
export class Content {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: String, required: true })
  iframe: string;

  @Prop({ type: Array, required: true })
  links: Array<ILink>;

  @Prop({ type: Array, required: true })
  questions: Array<IQuestions>;

  @Prop({ type: Array, required: true })
  prizes: Array<string>;
}

export const ContentSchema = SchemaFactory.createForClass(Content);
