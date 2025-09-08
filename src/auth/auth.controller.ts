import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ForgetPasswordDto } from './dto/forgetPassword-auth.dto';
import { VerifyCodeDto } from './dto/verifyCode-auth.dto';
import { signInDto } from './dto/signIn-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  SignUp(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.SignUp(createAuthDto);
  }

  @Post('signIn')
  SignIn(@Body() signDto: signInDto) {
    return this.authService.SignIn(signDto);
  }
  @Post('forgetPassword')
  forgetPassword(@Body() forgetPasswrdDto: ForgetPasswordDto) {
    return this.authService.forgetPassword(forgetPasswrdDto);
  }
  @Post('verifyCode')
  verifyCode(@Body() verifyCodeDto: VerifyCodeDto) {
    return this.authService.verifyCode(verifyCodeDto);
  }
  @Post('changePassword')
  changePassword(@Body() changePasswordDto: signInDto) {
    return this.authService.changePassword(changePasswordDto);
  }
}
