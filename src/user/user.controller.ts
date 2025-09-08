import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Roles } from 'src/auth/guard/Roles.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from '@prisma/client';
import { request } from 'express';
@Roles(['admin'])
@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll(@Request() req, @Query() query) {
    console.log(req.user);
    return await this.userService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}

@Roles(['User'])
@UseGuards(AuthGuard)
@Controller('userMe')
export class UserMeController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}
  @Get()
  async Me(@Request() req) {
    return await this.userService.getMe(req.user.id);
  }
  @Patch()
  async updateMe(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.updateMe(req.user.id, updateUserDto);
  }
  @Delete()
  async deleteMe(@Request() req) {
    return await this.userService.deleteMe(req.user.id);
  }
}
