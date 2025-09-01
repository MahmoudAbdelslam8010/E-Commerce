import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
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
  async SignIn(createAuthDto: CreateAuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: createAuthDto.email,
      },
    });
    if (!user) {
      throw new NotFoundException('user is not found');
    }
    const passwordIsCorrect = await bcrypt.compare(
      createAuthDto.password,
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
}
