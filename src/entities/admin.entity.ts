/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Teacher } from './teacher.entity';
@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Teacher, (teacher) => teacher.admin, { cascade: true })
  teacher: Teacher[];
}
