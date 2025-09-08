import { IsString, IsOptional, IsUrl, IsBoolean } from 'class-validator';

export class CreateBrandDto {
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsOptional()
  @IsUrl({}, { message: 'Image must be a valid URL' })
  image?: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
