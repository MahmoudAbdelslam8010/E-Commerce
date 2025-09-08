import { IsEmail, IsString, Length } from 'class-validator';

export class VerifyCodeDto {
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  @Length(6, 6, { message: 'Code should be 6 digits' })
  code: string;
}
