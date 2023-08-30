/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Admin } from './admin.entity';
@Entity('teachers')
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => Admin, (Admin) => Admin.id)
  admin: Admin;
}
