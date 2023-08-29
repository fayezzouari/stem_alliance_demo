import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}
  async registerSchool(data: any): Promise<any> {
    return this.adminRepository.save(data);
  }
  async loginSchool(condition: any): Promise<any> {
    return this.adminRepository.findOneBy(condition);
  }
  async getOneAdmin(condition: any): Promise<any> {
    return this.adminRepository.findOneBy(condition);
  }
}
