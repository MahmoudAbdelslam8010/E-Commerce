import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsUrl,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Name must be more than 3 characters' })
  @MaxLength(30, { message: 'Name must be less than 30 characters' })
  name: string;
  @IsUrl({}, { message: 'Image must be a valid URL' })
  @IsOptional()
  image: string;
}
