import { getEmoji } from "./emoji.service";

export type UserSafe = {
  id: number;
  emoji: string;
  name: string;
  win: number;
  lose: number;
  draw: number;
};

export type UserPrivate = UserSafe & {
  send: (d: string) => void;
  ip: string;
  isOnline: boolean;
};

const userStore = new Map<string, UserPrivate>();
let userId = 100;

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

export function createUser(ip: string, name: string, send: (d: string) => void) {
  userStore.forEach((user) => {
    if (user.ip === ip) {
      throw new Error("User already exists");
    }
    if (user.name === name) {
      throw new Error("User name already exists");
    }
  });

  let user = {
    id: userId,
    ip,
    emoji: getEmoji(),
    name: `${name}[${ip}]`,
    send,
    isOnline: true,
    win: 0,
    lose: 0,
    draw: 0,
  };

  userStore.set(ip, user);
  userId += 1;

  return user;
}

export function getOnlineUsers(): UserPrivate[] {
  const privateUsers: UserPrivate[] = []

  userStore.forEach((user) => {
    if (user.isOnline) {
      privateUsers.push(user)
    }
  })

  return privateUsers;
}

export function setIsOnline(ip: string) {
  let user = getUser(ip);

  user.isOnline = true;
}

export function setIsOffline(ip: string) {
  let user = getUser(ip);

  user.isOnline = false;
}
