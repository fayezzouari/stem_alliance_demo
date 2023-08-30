/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { Admin } from 'typeorm';

@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private jwtService: JwtService,
  ) {}

  //School Functions
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
    return { message: 'success' };
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
    return rest;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  catch(e) {
    throw new UnauthorizedException();
  }

  @Get('admins')
  async getAdmins() {
    const admins = await this.appService.getAllAdmins();
    const modifiedAdmins = admins.map(({ id, password, ...rest }) => rest);

    return modifiedAdmins;
  }

  //Teacher Functions
  @Post('registerTeacher')
  async registerTeacher(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.appService.registerTeacher({
      name,
      email,
      password: hashedPassword,
    });
  }

  @Post('loginTeacher')
  async loginTeacher(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const admin = await this.appService.loginTeacher({ email });
    if (!admin) {
      throw new BadRequestException('Invalid Credentials');
    }
    if (!(await bcrypt.compare(password, admin.password))) {
      throw new BadRequestException('Invalid Credentials');
    }
    const jwt = await this.jwtService.signAsync({ id: admin.id });
    res.cookie('jwt', jwt, { httpOnly: true });
    return { message: 'success' };
  }

  @Get('teacher')
  async getTeacher(@Req() req: Request) {
    const cookie = req.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);
    if (!data) {
      throw new UnauthorizedException();
    }
    const teacher = await this.appService.getOneTeacher(data['id']);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = teacher;
    return rest;
  }
  @Get('teachers')
  async getTeachers() {
    const admins = await this.appService.getAllTeachers();
    const modifiedAdmins = admins.map(({ id, password, ...rest }) => rest);

    return modifiedAdmins;
  }

  //logout
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
    return {
      message: 'success',
    };
  }
}
