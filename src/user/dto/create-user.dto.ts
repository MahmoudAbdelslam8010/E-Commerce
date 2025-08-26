import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsOptional,
  IsInt,
  Length,
  IsEnum,
  length,
  IsUrl,
} from 'class-validator';
import { Role, activeEnum, genderEnum } from '../../../generated/prisma';
export class CreateUserDto {
  //c
  @IsString()
  @MinLength(3, { message: 'name be more than 3 digits' })
  @MaxLength(20)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3, { message: 'password be more than 3 numbers' })
  @MaxLength(20)
  password: string;

  @IsEnum(Role)
  @IsOptional()
  Role?: Role; // optional, default User

  @IsString()
  @IsOptional()
  @IsUrl({}, { message: 'avatar must be a valid URL' })
  avatar?: string;

  @IsInt()
  @IsOptional()
  age?: number;

  @IsString()
  @Length(11, 11, { message: 'Phone must be 11 digits' })
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  adress?: string;

  @IsEnum(activeEnum)
  @IsOptional()
  active?: activeEnum;

  @IsString()
  @IsOptional()
  verificationCode?: string;

  @IsEnum(genderEnum)
  @IsOptional()
  gender?: genderEnum;
}
