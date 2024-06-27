import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { CreateItemDto } from "../dto/ItemDto";
import { MagicItem } from "../entity/magicItem";
import { CustomError } from "../middleware/CustomError";

export const createItem = async (req: Request, res: Response) => {
  const itemDto = plainToInstance(CreateItemDto, req.body);
  const errors = await validate(itemDto);

  if (errors.length > 0) {
    const errorMessages = errors
      .map((error) => Object.values(error.constraints!))
      .flat()
      .join(". ");
    throw new CustomError(400, "VALIDATION_ERROR", errorMessages);
  }

  const existingItem = await MagicItem.findOne({
    where: { name: itemDto.name },
  });

  if (existingItem) {
    throw new CustomError(400, "ITEM_EXISTS");
  }

  const item = MagicItem.create(req.body);
  await item.save();
  res.status(201).json({ success: item });
};

export const getItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = parseInt(req.query.skip as string) || 0;
  const order = (req.query.order as "ASC" | "DESC") || "DESC";

  const [items, total] = await MagicItem.findAndCount({
    order: { id: order },
    take: limit,
    skip: skip,
  });

  res.json({ success: true, items, total, limit, skip });
};

export const getItemById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = parseInt(req.params.id, 10);

  const item = await MagicItem.findOne({ where: { id } });

  if (!item) {
    throw new CustomError(404, "ITEM_NOT_FOUND");
  }
  res.json({ success: true, item });
};

export const deleteItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = parseInt(req.params.id, 10);

  const item = await MagicItem.findOne({ where: { id } });

  if (!item) {
    throw new CustomError(404, "ITEM_NOT_FOUND");
  }

  await item.remove();
  res.json({ success: true, message: "Item deleted successfully" });
};
