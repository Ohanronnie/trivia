import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import * as bcrypt from 'bcryptjs';
@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          let schema = UserSchema;
          schema.pre('save', function () {
            if (!!this.password) {
              if (this.isNew || this.isModified('password')) {
                this.password = bcrypt.hashSync(this.password);
              }
            }
          });
          return schema;
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
