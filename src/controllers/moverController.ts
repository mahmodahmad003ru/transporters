import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { CreateMoverDto, LoadItemDto } from "../dto/MoverDto";
import { MagicItem } from "../entity/magicItem";
import { MagicMover } from "../entity/magicMover";
import { QuestState } from "../enum/QuestState";
import { CustomError } from "../middleware/CustomError";

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
    return next(new CustomError(400, "VALIDATION_ERROR", errorMessages));
  }

  const mover = MagicMover.create(req.body);

  try {
    await mover.save();
    res.status(201).json(mover);
  } catch (error: any) {
    return next(new CustomError(500, "OPERATION_FAILED", error.message));
  }
};

export const getMovers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const movers = await MagicMover.find();
    res.json(movers);
  } catch (error: any) {
    return next(new CustomError(500, "OPERATION_FAILED", error.message));
  }
};

export const getMoverById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = parseInt(req.params.id, 10);

  try {
    const mover = await MagicMover.findOne({
      where: { id },
      relations: ["items"],
    });

    if (!mover) {
      return next(new CustomError(404, "MOVER_NOT_FOUND"));
    }
    res.json(mover);
  } catch (error: any) {
    return next(new CustomError(500, "OPERATION_FAILED", error.message));
  }
};

export const loadMover = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = parseInt(req.params.id, 10);

  try {
    const mover = await MagicMover.findOne({
      where: { id },
      relations: ["items"],
    });

    if (!mover) {
      return next(new CustomError(404, "MOVER_NOT_FOUND"));
    }

    const loadItemDto = plainToInstance(LoadItemDto, req.body);
    const errors = await validate(loadItemDto);

    if (errors.length > 0) {
      const errorMessages = errors
        .map((error) => Object.values(error.constraints!))
        .flat()
        .join(". ");
      return next(new CustomError(400, "VALIDATION_ERROR", errorMessages));
    }

    const item = await MagicItem.findOne({ where: { id: loadItemDto.itemId } });

    if (!item) {
      return next(new CustomError(404, "ITEM_NOT_FOUND"));
    }

    const totalWeight = mover.items.reduce((sum, item) => sum + item.weight, 0);

    if (totalWeight + item.weight > mover.weightLimit) {
      return next(new CustomError(400, "WEIGHT_LIMIT_EXCEEDED"));
    }

    mover.items.push(item);
    mover.questState = QuestState.LOADING;
    await mover.save();

    res.status(200).json(mover);
  } catch (error: any) {
    return next(new CustomError(500, "OPERATION_FAILED", error.message));
  }
};

export const startMission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = parseInt(req.params.id, 10);

  try {
    const mover = await MagicMover.findOne({ where: { id } });

    if (!mover) {
      return next(new CustomError(404, "MOVER_NOT_FOUND"));
    }

    mover.questState = QuestState.ON_A_MISSION;
    await mover.save();

    res.status(200).json(mover);
  } catch (error: any) {
    return next(new CustomError(500, "OPERATION_FAILED", error.message));
  }
};

export const endMission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = parseInt(req.params.id, 10);

  try {
    const mover = await MagicMover.findOne({
      where: { id },
      relations: ["items"],
    });

    if (!mover) {
      return next(new CustomError(404, "MOVER_NOT_FOUND"));
    }

    mover.questState = QuestState.DONE;
    mover.items = [];
    mover.missionsCompleted += 1;
    await mover.save();

    res.status(200).json(mover);
  } catch (error: any) {
    return next(new CustomError(500, "OPERATION_FAILED", error.message));
  }
};

export const getTopMovers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const movers = await MagicMover.createQueryBuilder("mover")
      .orderBy("mover.missionsCompleted", "DESC")
      .getMany();

    res.status(200).json(movers);
  } catch (error: any) {
    return next(new CustomError(500, "OPERATION_FAILED", error.message));
  }
};
