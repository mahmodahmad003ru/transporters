import { NextFunction, Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { MagicMover } from "../entity/magicMover";
import { MagicItem } from "../entity/magicItem";
import { CustomError } from "../middleware/CustomError";
import { CreateMoverDto, UpdateMoverDto, LoadItemsDto } from "../dto/MoverDto";
import { QuestState } from "../enum/QuestState";
import { In } from "typeorm";
import actionsLogger from "../utils/actionsLogger";

export const createMover = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const moverDto = plainToInstance(CreateMoverDto, req.body);
  const errors = await validate(moverDto);

  if (errors.length > 0) {
    const errorMessages = errors
      .map((error) => Object.values(error.constraints!))
      .flat()
      .join(". ");
    throw new CustomError(400, "VALIDATION_ERROR", errorMessages);
  }

  const existingMover = await MagicMover.findOne({
    where: { name: moverDto.name },
  });

  if (existingMover) {
    throw new CustomError(
      400,
      "MOVER_EXISTS",
      "A mover with the same name already exists"
    );
  }

  const mover = MagicMover.create(req.body);
  await mover.save();
  res.status(201).json({ success: true, mover });
};

export const getMovers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = parseInt(req.query.offset as string) || 0;
  const order = (req.query.order as "ASC" | "DESC") || "DESC";

  const [movers, total] = await MagicMover.findAndCount({
    order: { id: order },
    take: limit,
    skip: skip,
  });

  res.json({ total, movers, limit, skip });
};

export const getMoverById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = parseInt(req.params.id, 10);

  const mover = await MagicMover.findOne({
    where: { id },
    relations: ["items"],
  });

  if (!mover) {
    throw new CustomError(404, "MOVER_NOT_FOUND");
  }
  res.json({ success: true, mover });
};
export const loadMover = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = parseInt(req.params.id, 10);

  const mover = await MagicMover.findOne({
    where: { id },
    relations: ["items"],
  });

  if (!mover) {
    throw new CustomError(404, "MOVER_NOT_FOUND");
  }

  if (mover.questState === QuestState.ON_A_MISSION) {
    throw new CustomError(400, "MOVER_ON_MISSION");
  }

  const loadItemsDto = plainToInstance(LoadItemsDto, req.body);
  const errors = await validate(loadItemsDto);

  if (errors.length > 0) {
    const errorMessages = errors
      .map((error) => Object.values(error.constraints!))
      .flat()
      .join(". ");
    throw new CustomError(400, "VALIDATION_ERROR", errorMessages);
  }

  const items = await MagicItem.find({
    where: { id: In(loadItemsDto.itemIds) },
  });

  if (items.length !== loadItemsDto.itemIds.length) {
    throw new CustomError(
      404,
      "ITEMS_NOT_FOUND",
      "One or more items were not found"
    );
  }

  const totalWeight =
    mover.items.reduce((sum, item) => sum + item.weight, 0) +
    items.reduce((sum, item) => sum + item.weight, 0);

  if (totalWeight > mover.weightLimit) {
    throw new CustomError(400, "WEIGHT_LIMIT_EXCEEDED");
  }

  mover.items.push(...items);
  mover.questState = QuestState.LOADING;
  await mover.save();

  //the looger message
  actionsLogger.info(
    `Mover with ID ${mover.id} loaded with items: ${loadItemsDto.itemIds.join(
      ", "
    )}`
  );

  res.status(200).json({ success: true, mover });
};

export const startMission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = parseInt(req.params.id, 10);

  const mover = await MagicMover.findOne({ where: { id } });

  if (!mover) {
    throw new CustomError(404, "MOVER_NOT_FOUND");
  }

  mover.questState = QuestState.ON_A_MISSION;
  await mover.save();

  res.status(200).json({ success: true, mover });
};

export const endMission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = parseInt(req.params.id, 10);

  const mover = await MagicMover.findOne({
    where: { id },
    relations: ["items"],
  });

  if (!mover) {
    throw new CustomError(404, "MOVER_NOT_FOUND");
  }

  mover.questState = QuestState.DONE;
  mover.items = [];
  mover.missionsCompleted += 1;
  await mover.save();

  //the looger message
  actionsLogger.info(
    `Mover with ID ${mover.id} has completed the mission and unloaded all items`
  );

  res.status(200).json({ success: true, mover });
};

export const updateMover = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = parseInt(req.params.id, 10);
  const moverDto = plainToInstance(UpdateMoverDto, req.body);
  const errors = await validate(moverDto);

  if (errors.length > 0) {
    const errorMessages = errors
      .map((error) => Object.values(error.constraints!))
      .flat()
      .join(". ");
    throw new CustomError(400, "VALIDATION_ERROR", errorMessages);
  }

  const mover = await MagicMover.findOne({ where: { id } });

  if (!mover) {
    throw new CustomError(404, "MOVER_NOT_FOUND");
  }

  if (moverDto.name) {
    const existingMover = await MagicMover.findOne({
      where: { name: moverDto.name },
    });
    if (existingMover && existingMover.id !== id) {
      throw new CustomError(400, "NAME_EXISTS");
    }
  }

  Object.assign(mover, moverDto);
  await mover.save();

  res.status(200).json({ success: true, mover });
};

export const getTopMovers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const movers = await MagicMover.find({
    order: { missionsCompleted: "DESC" },
    take: 3,
  });

  res.status(200).json({ success: true, movers });
};
