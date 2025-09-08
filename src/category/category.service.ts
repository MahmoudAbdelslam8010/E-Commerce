import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const isCategoryExist = await this.prisma.category.findUnique({
      where: {
        name: createCategoryDto.name,
      },
    });
    if (isCategoryExist) {
      throw new ConflictException('Category already exists');
    }
    const category = await this.prisma.category.create({
      data: createCategoryDto,
    });
    return {
      status: 201,
      message: 'Category created successfully',
      data: category,
    };
  }

  async findAll() {
    const categories = await this.prisma.category.findMany({
      where: {
        active: true,
      },
    });
    if (categories.length === 0) {
      throw new NotFoundException('Categories Not Found');
    }
    return {
      status: 200,
      message: 'Categories fetched successfully',
      data: categories,
    };
    return `This action returns all category`;
  }
  async notActiveCatgories() {
    const categories = await this.prisma.category.findMany({
      where: {
        active: false,
      },
    });
    if (categories.length === 0) {
      throw new NotFoundException('Categories Not Found');
    }
    return {
      status: 200,
      message: 'Categories fetched successfully',
      data: categories,
    };
    return `This action returns all category`;
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: {
        id: id,
      },
    });
    if (!category) {
      throw new NotFoundException('Category Not Found');
    }
    return {
      status: 200,
      message: 'Category fetched successfully',
      data: category,
    };
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: {
        id: id,
      },
    });
    if (!category) {
      throw new NotFoundException('Category Not Found');
    }
    const updatedCategory = await this.prisma.category.update({
      where: {
        id: id,
      },
      data: updateCategoryDto,
    });
    return {
      status: 200,
      message: 'Category updated successfully',
      data: updatedCategory,
    };
  }

  async remove(id: string) {
    const category = await this.prisma.category.findUnique({
      where: {
        id: id,
      },
    });
    if (!category) {
      throw new NotFoundException('Category Not Found');
    }
    await this.prisma.category.update({
      where: {
        id: id,
      },
      data: {
        active: false,
      },
    });
    return {
      status: 200,
      message: 'Category deleted successfully',
    };
  }
}
