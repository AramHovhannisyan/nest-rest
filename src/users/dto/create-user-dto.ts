import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@mail.com', description: 'User Emali' })
  @IsString({ message: 'Must Be a String' })
  @IsEmail({}, { message: 'Must Be An Email' })
  readonly email: string;

  @ApiProperty({ example: 'pass12345', description: 'User Password' })
  @IsString({ message: 'Must Be a String' })
  @Length(4, 16, { message: 'Min 4 Max 16 symbols' })
  readonly password: string;
}
