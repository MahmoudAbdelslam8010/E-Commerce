import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BrandService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBrandDto) {
    const isBrandExist = await this.prisma.brand.findUnique({
      where: {
        name: dto.name,
      },
    });
    if (isBrandExist) {
      throw new ConflictException('Brand already exists');
    }
    const brand = await this.prisma.brand.create({ data: dto });

    return {
      status: 201,
      message: 'Brand created successfully',
      data: brand,
    };
  }

  async findAll() {
    const brands = await this.prisma.brand.findMany({
      where: {
        active: true,
      },
    });
    if (brands.length === 0) {
      throw new NotFoundException('Brands not found');
    }
    return {
      status: 200,
      message: 'Brands fetched successfully',
      data: brands,
    };
  }
  async NotActivatedBrands() {
    const brands = await this.prisma.brand.findMany({
      where: {
        active: false,
      },
    });
    if (brands.length === 0) {
      throw new NotFoundException('Brands not found');
    }
    return {
      status: 200,
      message: 'Not Activated Brands fetched successfully',
      data: brands,
    };
  }

  async findOne(id: string) {
    const brand = await this.prisma.brand.findUnique({
      where: {
        id,
      },
    });
    if (!brand) throw new NotFoundException('Brand not found');
    return {
      status: 200,
      message: 'Brand fetched successfully',
      data: brand,
    };
  }

  async update(id: string, dto: UpdateBrandDto) {
    const isBrandExist = await this.prisma.brand.findUnique({
      where: {
        id: id,
      },
    });
    if (!isBrandExist) {
      throw new NotFoundException('Brand not found');
    }
    const brand = await this.prisma.brand.update({ where: { id }, data: dto });
    return {
      status: 200,
      message: 'Brand updated successfully',
      data: brand,
    };
    return this.prisma.brand.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    const brand = await this.findOne(id);
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    await this.prisma.brand.update({ where: { id }, data: { active: false } });
    return {
      status: 200,
      message: 'Brand deleted successfully',
    };
  }
}
