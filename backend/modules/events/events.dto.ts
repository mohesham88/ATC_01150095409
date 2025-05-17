import {
  IsArray,
  IsDate,
  IsISO8601,
  isISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  isURL,
  Min,
} from "../../utils/validation";

import { EventTags } from "./events.model";

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsISO8601() // checks if its a date
  @IsNotEmpty()
  date: Date;

  @IsString()
  @IsNotEmpty()
  venue: string;

  // @IsNumber()
  // @Min(0)
  @IsNotEmpty()
  price: number;

  // @IsArray()
  @IsOptional()
  tags: [EventTags];
}

export class UpdateEventDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;

  // @IsISO8601()
  @IsOptional()
  date?: Date;

  @IsString()
  @IsOptional()
  venue?: string;

  // @IsNumber()
  // @Min(0)
  @IsOptional()
  price?: number;

  @IsArray()
  @IsOptional()
  images?: [];

  @IsArray()
  @IsOptional()
  tags?: [EventTags];
}
