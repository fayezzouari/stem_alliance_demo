import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';
import { Teacher } from './entities/teacher.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
  ) {}
  async registerSchool(data: any): Promise<any> {
    return this.adminRepository.save(data);
  }
  async registerTeacher(data: any): Promise<any> {
    return this.teacherRepository.save(data);
  }
  async loginSchool(condition: any): Promise<any> {
    return this.adminRepository.findOneBy(condition);
  }
  async loginTeacher(condition: any): Promise<any> {
    return this.teacherRepository.findOneBy(condition);
  }
  async getOneAdmin(condition: any): Promise<any> {
    return this.adminRepository.findOneById(condition);
  }
  async getOneTeacher(condition: any): Promise<any> {
    return this.teacherRepository.findOneById(condition);
  }
  async getAllAdmins(): Promise<any> {
    return this.adminRepository.find();
  }
  async getAllTeachers(): Promise<any> {
    return this.teacherRepository.find();
  }
}
