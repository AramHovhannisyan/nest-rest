import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './roles.model';
import { CreateRoleDto } from './dto/create-role-dto';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role) private roleModel: typeof Role) {}

  async createOne(dto: CreateRoleDto) {
    const role = await this.roleModel.create({ ...dto });

    return role;
  }

  async getRoleByValue(value: string) {
    return await this.roleModel.findOne({ where: { value } });
  }
}
