import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { IGoogleLogin } from './user.dto';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  async handleGoogleLogin(body: IGoogleLogin) {
    try {
      let userExist = await this.userModel.findOne({ email: body.email });
      if (userExist)
        return {
          authType: 'login',
          success: true,
          userId: userExist._id,
        };
      let user = await this.userModel.create({
        email: body.email,
        username: body.username,
      });
      return { authType: 'register', success: true, userId: user._id };
    } catch (error: any) {
      console.log(error);
    }
  }
  async createUser(email: string, password: string, username: string) {
    try {
      if (password.length < 6)
        return { password: 'Password too short', success: false };
      let userExist = await this.userModel.findOne({ email });
      if (userExist) return { email: 'Email already exist', success: false };
      userExist = await this.userModel.findOne({ username });
      if (userExist)
        return { username: 'Username already exist', success: false };
      let user = await this.userModel.create({ username, email, password });
      return { authType: 'register', success: true };
    } catch (err: any) {
      console.log(err);
    }
  }
  async loginUser(email: string, password: string) {
    try {
      let user = await this.userModel.findOne({ email });
      if (!user) return { email: 'Email does not exist', success: false };
      let isPasswordCorrect = bcrypt.compareSync(password, user.password);
      if (!isPasswordCorrect)
        return { password: 'Incorrect Password', success: false };
      return { success: true, userId: user._id };
    } catch (err: any) {}
  }
  async updateUsername(userId: any, username: string) {
    if (username.length < 4) return 'Username too short';
    const user = await this.userModel.findOne({ username });
    if (user) return false;

    await this.userModel.findByIdAndUpdate(userId, { username });
    return true;
  }
  async updateBio(userId: any, bio: string, image: string) {
    console.log(userId, bio, image)
    try {
      await this.userModel.findByIdAndUpdate(userId, { bio, cover: image });
      return true;
    } catch (err: any) {}
  }
}
