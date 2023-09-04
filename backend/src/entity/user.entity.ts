import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("user")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  ip: string;

  @Column({
    nullable: false,
  })
  emoji: string;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: false,
    default: 0,
  })
  win: number;

  @Column({
    nullable: false,
    default: 0,
  })
  lose: number;

  @Column({
    nullable: false,
    default: 0,
  })
  draw: number;
}
