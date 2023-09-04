import { UserEntity } from "../entity/user.entity";
import { AppDataSource } from "./db.service";
import { getEmoji } from "./emoji.service";
import { createHash } from "./hash.service";

export type UserSafe = {
  id: number;
  emoji: string;
  name: string;
  win: number;
  lose: number;
  draw: number;
};

export type UserPrivate = UserEntity & {
  send: (d: string) => void;
};

const userStore = new Map<number, UserPrivate>();

export function hasUser(ip: string): boolean {
  return userStore.has(ip);
}

export function getUser(ip: string): UserPrivate {
  if (!hasUser(ip)) {
    throw new Error("User not found");
  }
  return userStore.get(ip) as UserPrivate;
}

export function getSafeUser(ip: string): UserSafe {
  return toSafeUser(getUser(ip));
}

export function getAllUsers(): UserPrivate[] {
  return Object.values(userStore);
}

export function toSafeUser(user: UserPrivate): UserSafe {
  return {
    id: user.id,
    emoji: user.emoji,
    name: user.name,
    win: user.win,
    lose: user.lose,
    draw: user.draw,
  };
}

export async function createUser(
  ip: string,
  pName: string,
  send: (d: string) => void
) {
  userStore.forEach((user) => {
    if (user.ip === ip) {
      throw new Error("User already exists");
    }
    if (user.name === pName) {
      throw new Error("User name already exists");
    }
  });

  const emoji = getEmoji();
  const name = `${pName}[${ip}]`;
  const hashedIp = await createHash(ip);

  const userEntity = AppDataSource.getRepository(UserEntity).create({
    emoji,
    name,
    ip: hashedIp,
  });
  const insertedUser =
    await AppDataSource.getRepository(UserEntity).save(userEntity);
  const augmentedUser = { ...insertedUser, send };

  userStore.set(insertedUser.id, augmentedUser);

  return augmentedUser;
}

export function getOnlineUsers(): UserPrivate[] {
  const privateUsers: UserPrivate[] = [];

  userStore.forEach((user) => {
    if (user.isOnline) {
      privateUsers.push(user);
    }
  });

  return privateUsers;
}

export async function setIsOffline(ip: string) {
  const hashedIp = await createHash(ip);

  user.isOnline = false;
}
