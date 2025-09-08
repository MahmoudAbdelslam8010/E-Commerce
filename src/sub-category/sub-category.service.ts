import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubCategoryService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createSubCategoryDto: CreateSubCategoryDto) {
    const isSubCategoryExist = await this.prisma.subCategory.findUnique({
      where: {
        name: createSubCategoryDto.name,
      },
    });
    if (isSubCategoryExist) {
      throw new ConflictException('Sub Category already exists');
    }
    const isCategoryExist = await this.prisma.category.findUnique({
      where: {
        id: createSubCategoryDto.categoryId,
      },
    });
    if (!isCategoryExist) {
      throw new NotFoundException('Category of Subcategory is not found');
    }

    const subCategory = await this.prisma.subCategory.create({
      data: {
        name: createSubCategoryDto.name,
        categoryId: createSubCategoryDto.categoryId,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return {
      status: 201,
      message: 'SubCategory created successfully',
      data: subCategory,
    };
  }

  async findAll() {
    const subCategories = await this.prisma.subCategory.findMany({
      where: {
        active: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (subCategories.length === 0) {
      throw new HttpException('there is no active subcategories', 400);
    }
    return {
      status: 200,
      data: subCategories,
    };
  }
  async notActiveSubCatgories() {
    const subCategories = await this.prisma.subCategory.findMany({
      where: {
        active: false,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (subCategories.length === 0) {
      throw new NotFoundException('there is no Inactive subcategories');
    }
    return {
      status: 200,
      data: subCategories,
    };
  }

  async findOne(id: string) {
    const subCategory = await this.prisma.subCategory.findUnique({
      where: {
        id,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!subCategory) {
      throw new NotFoundException('sub category is not found');
    }
    return {
      status: 200,
      data: subCategory,
    };
  }

  async update(id: string, updateSubCategoryDto: UpdateSubCategoryDto) {
    const isExist = await this.prisma.subCategory.findUnique({
      where: {
        id,
      },
    });
    if (!isExist) {
      throw new NotFoundException('this subcategory is not found ');
    }
    if (updateSubCategoryDto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: {
          id: updateSubCategoryDto.categoryId,
        },
      });
      if (!category) {
        throw new NotFoundException('category is not found');
      }
    }
    const subcategory = await this.prisma.subCategory.update({
      where: {
        id,
      },
      data: updateSubCategoryDto,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return {
      status: 200,
      data: subcategory,
    };
  }

  async remove(id: string) {
    const isExist = await this.prisma.subCategory.findUnique({
      where: {
        id,
      },
    });
    if (!isExist) {
      throw new NotFoundException('this subcategory is not found ');
    }

    await this.prisma.subCategory.update({
      where: {
        id,
      },
      data: {
        active: false,
      },
    });
    return {
      status: 200,
      message: 'subcategory is successfully deleted',
    };
  }
}
