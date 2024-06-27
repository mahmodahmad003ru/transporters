import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from "class-validator";
import { QuestState } from "../enum/QuestState";

export class CreateMoverDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  name!: string;

  @IsNotEmpty()
  @IsInt()
  weightLimit!: number;

  @IsNotEmpty()
  @IsInt()
  energy!: number;

  @IsOptional()
  @IsEnum(QuestState)
  questState?: QuestState;
}

export class UpdateMoverDto {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  name?: string;

  @IsOptional()
  @IsInt()
  weightLimit?: number;

  @IsOptional()
  @IsInt()
  energy?: number;

  @IsOptional()
  @IsEnum(QuestState)
  questState?: QuestState;
}

export class LoadItemsDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsInt({ each: true })
  itemIds!: number[];
}
