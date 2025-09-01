import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  saltOrRounds = 10;
  async create(createUserDto: CreateUserDto) {
    const isEmailExist = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email.toLowerCase().trim(),
      },
    });
    if (isEmailExist) {
      throw new ConflictException('user is already exist , use another one ');
    }

    const hashPassword = await bcrypt.hash(
      createUserDto.password,
      this.saltOrRounds,
    );
    const editFields = {
      password: hashPassword,
      email: createUserDto.email.toLowerCase().trim(),
      name: createUserDto.name.trim(),
    };
    const NewUser = await this.prisma.user.create({
      data: { ...createUserDto, ...editFields },
    });
    const { password: _, ...result } = NewUser;
    return {
      status: 201,
      message: `${createUserDto.Role} Created successfully`,
      data: result,
    };
  }

  async findAll(query: any) {
    const { limit = 100000, skip = 0, sort = 'asc', name, email, Role } = query;
    if (Number.isNaN(Number(+limit))) {
      throw new HttpException('please enter valid limit', 400);
    }
    if (Number.isNaN(Number(+skip))) {
      throw new HttpException('please enter valid skip number ', 400);
    }
    if (!['asc', 'desc'].includes(sort)) {
      throw new HttpException('Invalid sort , asc & desc only valid', 400);
    }
    const where: any = {};
    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive',
      };
    }
    if (email) {
      where.email = {
        contains: email,
        mode: 'insensitive',
      };
    }
    const Users = await this.prisma.user.findMany({
      where,
      skip: Number(skip),
      take: Number(limit),
      orderBy: {
        name: sort,
      },
    });
    const result = Users.map(({ password, ...rest }) => rest);
    const totalCount = await this.prisma.user.count({ where });
    return {
      status: 200,
      message: `found ${Users.length} Users`,
      data: result,
      pagination: {
        total_users: totalCount,
        pageNo: Math.floor(Number(skip) / Number(limit) + 1),
        skip: Number(skip),
        limit:
          Number(limit) === 100000
            ? 'there is no specific limit'
            : Number(limit),
        hasMore: Number(skip) + Number(limit) < totalCount,
        totalPages: Math.ceil(totalCount / Number(limit)),
      },
    };
  }

  async findOne(id: string) {
    const User = await this.prisma.user.findFirst({
      where: { id },
    });
    if (!User) {
      throw new NotFoundException('the user is not found');
    }
    const { password, ...FoundedUser } = User;
    return {
      status: 200,
      data: FoundedUser,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const userExist = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!userExist) {
      throw new NotFoundException('User not found');
    }
    let user = {
      ...updateUserDto,
    };

    if (updateUserDto.password) {
      if (updateUserDto.password.length < 8) {
        throw new BadRequestException(
          'Password must be at least 8 characters long',
        );
      }
      const password = await bcrypt.hash(
        updateUserDto.password,
        this.saltOrRounds,
      );
      user = {
        ...user,
        password,
      };
    }
    if (updateUserDto.name) {
      updateUserDto.name = updateUserDto.name.trim();
    }
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
    return {
      status: 200,
      message: 'User updated successfully',
      data: userWithoutPassword,
    };
  }

  async remove(id: string) {
    const checkUser = await this.prisma.user.findFirst({
      where: {
        id: id,
      },
    });
    if (!checkUser) {
      throw new NotFoundException('User is not found');
    }
    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        active: false,
      },
    });
    return {
      status: 200,
      message: `${checkUser.Role} deleted successfully`,
    };
  }
  async getMe(UserId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: UserId,
      },
    });
    if (!user) {
      throw new NotFoundException('User Is Not Found');
    }
    const { password, ...result } = user;

    return {
      status: 200,
      message: 'done',
      data: result,
    };
  }
  async updateMe(UserId: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: UserId,
      },
    });
    if (!user) {
      throw new NotFoundException('User Is Not Found');
    }
    if (updateUserDto.Role) {
      throw new UnauthorizedException();
    }
    const updatedUser = await this.prisma.user.update({
      where: { id: UserId },
      data: updateUserDto,
    });
    const { password, ...result } = updatedUser;
    return {
      status: 200,
      message: 'User updated successfully',
      data: result,
    };
  }

  async deleteMe(UserId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: UserId,
      },
    });
    if (!user) {
      throw new NotFoundException('User Is Not Found');
    }
    const softDelete = await this.prisma.user.update({
      where: {
        id: UserId,
      },
      data: {
        active: false,
      },
    });
    return {
      status: 200,
      message: 'deleted successfully',
    };
  }
}
