import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { QuestState } from "../enum/QuestState";
import { MagicItem } from "./magicItem";

@Entity()
export class MagicMover extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  weightLimit!: number;

  @Column()
  energy!: number;

  @Column({
    type: "enum",
    enum: QuestState,
    default: QuestState.RESTING,
  })
  questState!: QuestState;

  @Column({ default: 0 })
  missionsCompleted!: number;

  @OneToMany(() => MagicItem, (item) => item.mover)
  items!: MagicItem[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
