import { IsNumber, IsString } from 'class-validator';

export class AddRoleDto {
  @IsString({ message: 'Must Be a String' })
  readonly value: string;

  @IsNumber({}, { message: 'Must Be Numeric' })
  readonly userId: number;
}
