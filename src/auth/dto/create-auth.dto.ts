import { genderEnum } from '@prisma/client';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAuthDto {
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

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @IsEnum(genderEnum)
  @IsOptional()
  gender?: genderEnum;
}
