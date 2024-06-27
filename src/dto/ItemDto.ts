import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from "class-validator";

export class CreateItemDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  name!: string;

  @IsNotEmpty()
  @IsInt()
  weight!: number;
}

export class UpdateItemDto {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  name?: string;

  @IsOptional()
  @IsInt()
  weight?: number;
}
