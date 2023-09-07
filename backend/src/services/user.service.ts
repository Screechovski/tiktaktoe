import { UserEntity } from "../entity/user.entity";
import { DBInstance } from "./db.service";
import { getEmoji } from "./emoji.service";

type Send = (d: string) => void;

export type UserSafe = Omit<UserEntity, "ip">;

export type UserPrivate = UserEntity & {
  send: Send;
};

const onlineUsers = new Map<string, UserPrivate>();

export async function hasUser(ip: string): Promise<boolean> {
 const user =  await DBInstance.getRepository(UserEntity).findOne({ where: { ip } })

 return user !== null;
}

export async function getUser(ip: string): Promise<UserPrivate> {
  if (!(await hasUser(ip))) {
    throw new Error("User not found in bd")
  }

  if (!onlineUsers.has(ip)) {
    throw new Error("User offline")
  }

  const user = onlineUsers.get(ip);

  if (user === undefined) {
    throw new Error("User not found")
  }

  return user;
}

export async function getSafeUser(ip: string): Promise<UserSafe> {
  return toSafeUser(await getUser(ip));
}

export function toSafeUser(user: UserEntity | UserPrivate): UserSafe {
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
  name: string,
  send: (d: string) => void
) {
  const user = await DBInstance.getRepository(UserEntity).findOne({where: { ip }})

  if (user !== null) {
    throw new Error("User already exist")
  }

  const userWithTheSameName = await DBInstance.getRepository(UserEntity).findOne({where: { name }})

  if (userWithTheSameName !== null) {
    throw new Error("User with the same name already exists")
  }

  const emoji = getEmoji();

  const userEntity = DBInstance.getRepository(UserEntity).create({
    emoji,
    name: `${name}[${ip}]`,
    ip,
  });
  const insertedUser = await DBInstance.getRepository(UserEntity).save(userEntity);
  const augmentedUser = { ...insertedUser, send };

  onlineUsers.set(ip, augmentedUser);

  return augmentedUser;
}

export function getOnlineUsers(): UserPrivate[] {
  const users: UserPrivate[] = []

  onlineUsers.forEach((_, ip) => {
    users.push(user)
  })

  return users
}

export async function setIsOffline(ip: string) {
  if (!hasUser(ip)) {
    throw new Error("User not found");
  }
  onlineUsers.delete(ip);
}

export async function setIsOnline(ip: string, send: (d: string) => void) {
  if (!(await hasUser(ip))) {
    throw new Error("User not found");
  }
  const user = await getUser(ip);

  onlineUsers.set(ip, {
    ...user,
    send
  })
}

export async function userSync(ip: string){
  const dbUser = await DBInstance.getRepository(UserEntity).findOne({where: { ip }});

  if (dbUser === null) {
    throw new Error("User not found");
  }

  const localUser = onlineUsers.get(ip);

  if (localUser === undefined) {
    throw new Error("User not found");
  }

  await DBInstance.getRepository(UserEntity).save({
    id: localUser.id,
    ip: localUser.ip,
    draw: localUser.draw,
    win: localUser.win,
    lose: localUser.lose
  })

  // AppDataSource.getRepository(UserEntity)
}
