import {
  Entity,
  Column,
  OneToMany,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { MagicItem } from "./magicItem";
import { QuestState } from "../enum/QuestState";

@Entity()
export class MagicMover extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

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
