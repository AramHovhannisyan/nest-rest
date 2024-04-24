import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../users/users.model';
import { UserRoles } from './UserRoles.model';

interface createRoleAtts {
  value: string;
  description: string;
}

@Table({ tableName: 'roles' })
export class Role<Model, createRoleAtts> extends Model {
  @ApiProperty({ example: 1, description: 'Role ID' })
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  })
  id: number;

  @ApiProperty({ example: 'ROLENAME', description: 'User Role Value' })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  value: string;

  @ApiProperty({ example: 'Some Info', description: 'User Role Description' })
  @Column({ type: DataType.STRING, allowNull: false })
  description: string;

  @BelongsToMany(() => User, () => UserRoles)
  users: User<any, any>[];
}
