import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ForgetPasswordDto } from './dto/forgetPassword-auth.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { VerifyCodeDto } from './dto/verifyCode-auth.dto';
import { signInDto } from './dto/signIn-auth.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}
  saltOrRounds = 10;

  async SignUp(createAuthDto: CreateAuthDto) {
    const isEmailExist = await this.prisma.user.findUnique({
      where: {
        email: createAuthDto.email.toLowerCase().trim(),
      },
    });
    if (isEmailExist) {
      throw new ConflictException('user is already exist , use another one ');
    }
    const hashPassword = await bcrypt.hash(
      createAuthDto.password,
      this.saltOrRounds,
    );
    const editFields = {
      password: hashPassword,
      email: createAuthDto.email.toLowerCase().trim(),
      name: createAuthDto.name.trim(),
    };
    const newUser = await this.prisma.user.create({
      data: { ...createAuthDto, ...editFields },
    });
    const payload = {
      id: newUser.id,
      role: 'User',
      email: createAuthDto.email,
    };
    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });
    const { password: _, ...result } = newUser;
    return {
      status: 201,
      message: 'created successfully',
      data: result,
      token,
    };
  }
  async SignIn(signDto: signInDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: signDto.email,
      },
    });
    if (!user) {
      throw new NotFoundException('user is not found');
    }
    const passwordIsCorrect = await bcrypt.compare(
      signDto.password,
      user.password,
    );
    if (!passwordIsCorrect) {
      throw new UnauthorizedException('password not correct');
    }
    const payload = {
      id: user.id,
      email: user.email,
      role: 'User',
    };
    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });
    return {
      status: 200,
      message: `Welcome ${user.name}`,
      token,
    };
  }
  async forgetPassword(forgetPasswordDto: ForgetPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: forgetPasswordDto.email,
      },
    });
    if (!user) {
      throw new NotFoundException('user is not found');
    }
    const code = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');
    await this.prisma.user.update({
      where: {
        email: forgetPasswordDto.email,
      },
      data: {
        verificationCode: code,
      },
    });
    const htmlMessage = `<div>
      <h1>Forgot your password? If you didn't forget your password, please ignore this email!</h1>
      <p>Use the following code to verify your account: <h3 style="color: red; font-weight: bold; text-align: center">${code}</h3></p>
      <h6 style="font-weight: bold">Ecommerce-Nest.JS</h6>
    </div>`;
    await this.mailerService.sendMail({
      from: `Test Spam Sanadi <${process.env.EMAIL_USERNAME}>`,
      to: forgetPasswordDto.email,
      subject: `Test Spam Sanadi - Reset Password`,
      html: htmlMessage,
    });
    return {
      status: 200,
      message: `Code sent successfully on your ${forgetPasswordDto.email}`,
    };
  }
  async verifyCode(verifyCodeDto: VerifyCodeDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: verifyCodeDto.email,
      },
    });
    if (!user) {
      throw new NotFoundException('user is not found');
    }
    if (user.verificationCode !== verifyCodeDto.code) {
      throw new UnauthorizedException('invalid code');
    }
    await this.prisma.user.update({
      where: {
        email: verifyCodeDto.email,
      },
      data: {
        verificationCode: verifyCodeDto.code,
      },
    });
    return {
      status: 200,
      message: 'Code verified successfully, go to change your password',
    };
  }
  async changePassword(changePasswordDto: signInDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: changePasswordDto.email,
      },
    });
    if (!user) {
      throw new NotFoundException('user is not found');
    }
    const hashedPassword = await bcrypt.hash(
      changePasswordDto.password,
      this.saltOrRounds,
    );
    await this.prisma.user.update({
      where: {
        email: changePasswordDto.email,
      },
      data: {
        password: hashedPassword,
      },
    });
    return {
      status: 200,
      message: 'your password changed successfully',
    };
  }
}
