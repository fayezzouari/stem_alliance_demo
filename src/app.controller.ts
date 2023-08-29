import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AppService } from './app.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private jwtService: JwtService,
  ) {}

  @Post('registerSchool')
  async registerSchool(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.appService.registerSchool({
      name,
      email,
      password: hashedPassword,
    });
  }

  @Post('loginSchool')
  async loginSchool(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const admin = await this.appService.loginSchool({ email });
    if (!admin) {
      throw new BadRequestException('Invalid Credentials');
    }
    if (!(await bcrypt.compare(password, admin.password))) {
      throw new BadRequestException('Invalid Credentials');
    }
    const jwt = await this.jwtService.signAsync({ id: admin.id });
    res.cookie('jwt', jwt, { httpOnly: true });
    return jwt;
  }

  @Get('admin')
  async getAdmin(@Req() req: Request) {
    const cookie = req.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);
    if (!data) {
      throw new UnauthorizedException();
    }
    const admin = await this.appService.getOneAdmin(data['id']);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = admin;
    return admin;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  catch(e) {
    throw new UnauthorizedException();
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
    return {
      message: 'success',
    };
  }
  // @Get('admins')
  // async getAdmins(@Req() req: Request) {

  // } A faire-------------------------------
}
