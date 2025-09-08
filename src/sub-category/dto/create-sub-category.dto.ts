import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateSubCategoryDto {
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsUUID()
  categoryId: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
