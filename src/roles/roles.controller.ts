import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role-dto';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private roleService: RolesService) {}

  @Post()
  createRole(@Body() dto: CreateRoleDto) {
    return this.roleService.createOne(dto);
  }

  @Get('/:value')
  getRole(@Param('value') value: string) {
    return this.roleService.getRoleByValue(value);
  }
}
