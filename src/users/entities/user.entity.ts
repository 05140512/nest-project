import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Family } from '../../family/entities/family.entity';
import { Order } from '../../order/entities/order.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  username: string;

  @Column({ length: 100 })
  email: string;

  @Column({ length: 100, nullable: true })
  phone: string;

  @Column({ length: 200, nullable: true })
  address: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 一对多关系：一个用户可以有多个家庭
  @OneToMany(() => Family, (family) => family.user)
  families: Family[];

  // 一对多关系：一个用户可以下多个订单
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
