import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class signInDto {
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(3, { message: 'password be more than 3 numbers' })
  @MaxLength(20)
  password: string;
}
