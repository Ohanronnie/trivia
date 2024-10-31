import {
  Controller,
  UseGuards,
  Get,
  Body,
  Req,
  Render,
  Post,
  Res,
  HttpException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';

@Controller('')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Get('auth/google')
  @UseGuards(AuthGuard('google'))
  google() {}

  @Get('auth/google/redirect')
  @UseGuards(AuthGuard('google'))
  async googlelogin(@Req() req: any, @Res() res: any) {
    console.log(req.session.user);
    let result = await this.userService.handleGoogleLogin(req.user);
    req.session.user = result.userId;
    res.redirect('/content/create');
  }

  @Get('auth/login')
  @Render('auth/login')
  login() {}
  @Post('auth/login')
  async loginUser(@Body() body: any, @Res() res: Response, @Req() req: any) {
    const result = await this.userService.loginUser(body.email, body.password);
    if (!result.success) {
      return res.render('auth/login', {
        email: body.email,
        email_error: result.email,
        password_error: result.password,
      });
    }
    req.session.user = result.userId;
    res.redirect('/content/create');
  }
  @Get('auth/signup')
  @Render('auth/signup')
  signup() {}
  @Post('auth/signup')
  async createUser(@Body() user: any, @Res() res: Response) {
    const result = await this.userService.createUser(
      user.email,
      user.password,
      user.username,
    );
    if (!result.success) {
      return res.render('auth/signup', {
        email: user.email,
        username: user.username,
        email_error: result.email,
        password_error: result.password,
        user_error: result.username,
      });
    } else {
      return res.redirect('/auth/login');
    }
  }
}
