import { IsEmail, MinLength } from 'class-validator';

export class ForgetPasswordDto {
  @MinLength(0, { message: 'Email is required ' })
  @IsEmail({}, { message: 'Email is not valid ' })
  email: string;
}
