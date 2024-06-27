import { IsEnum, IsInt, IsNotEmpty, IsOptional } from "class-validator";
import { QuestState } from "../enum/QuestState";

export class CreateMoverDto {
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
  @IsInt()
  weightLimit?: number;

  @IsOptional()
  @IsInt()
  energy?: number;

  @IsOptional()
  @IsEnum(QuestState)
  questState?: QuestState;
}

export class LoadItemDto {
  @IsNotEmpty()
  @IsInt()
  itemId!: number;
}
