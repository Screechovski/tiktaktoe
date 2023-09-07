import type { UserPrivate, UserSafe } from "./user.service";

type Status = "waiting" | "process" | "end";

export type UserLobby<T> = T & {
  isReady: boolean;
  isHost: boolean;
  isPlay: boolean;
};

export type LobbySafe = {
  id: number;
  name: string;
  users: UserLobby<UserSafe>[];
  isPrivate: boolean;
  status: Status;
};

export type LobbyPrivate = {
  id: number;
  name: string;
  isPrivate: boolean;
  users: UserLobby<UserPrivate>[];
  password: string;
  gameId: number;
  status: Status;
  send(s: string | string[]): void;
};

let lobbyCounter = 1;
const lobbyStore = new Map<number, LobbyPrivate>();

export function getLobbies(): LobbyPrivate[] {
  const lobbies: LobbyPrivate[] = [];

  lobbyStore.forEach((lobby) => {
    lobbies.push(lobby);
  });

  return lobbies;
}

export function hasLobby(lobbyId: number) {
  return lobbyStore.has(lobbyId);
}

export function getLobby(lobbyId: number): LobbyPrivate {
  if (!hasLobby(lobbyId)) {
    throw new Error("Lobby not found");
  }
  return lobbyStore.get(lobbyId) as LobbyPrivate;
}

export function getSafeLobby(id: number): LobbySafe {
  return toSafeLobby(getLobby(id));
}

export function getSafeLobbies(): LobbySafe[] {
  return getLobbies().map(toSafeLobby);
}

export function toSafeLobby(lobby: LobbyPrivate): LobbySafe {
  return {
    id: lobby.id,
    name: lobby.name,
    users: lobby.users,
    isPrivate: lobby.isPrivate,
    status: lobby.status,
  };
}

export function createLobby(name: string, password: string, user: UserPrivate) {
  lobbyStore.forEach((lobby) => {
    if (lobby.name === name) {
      throw new Error("Lobby with the same name already exists");
    }
    if (lobby.users.find((insideUser) => insideUser.ip === user.ip)) {
      throw new Error("You already in lobby");
    }
  });

  const lobby: LobbyPrivate = {
    id: lobbyCounter,
    name,
    password,
    isPrivate: password !== "",
    gameId: -1,
    status: "waiting",
    users: [
      {
        ...user,
        isReady: false,
        isHost: true,
        isPlay: false,
      },
    ],
    send(s: string | string[]){
      if (Array.isArray(s)){
        this.users.forEach((u) => {
          s.forEach((m) => u.send(m))
        })
      } else {
        this.users.forEach((u) => {
          u.send(s)
        })
      }
    }
  };

  lobbyStore.set(lobbyCounter, lobby);
  lobbyCounter += 1;

  return lobby;
}

export function joinLobby(
  lobbyId: number,
  password: string,
  user: UserPrivate
): LobbyPrivate {
  lobbyStore.forEach((lobby) => {
    if (lobby.users.find((insideUser) => insideUser.ip === user.ip)) {
      throw new Error("You already in lobby");
    }
  });

  const lobby = getLobby(lobbyId);

  if (lobby.users.length === 2) {
    throw new Error("Lobby is full");
  }

  const lobbyUser = {
    ...user,
    isReady: false,
    isHost: false,
    isPlay: false,
  };

  if (lobby.isPrivate && lobby.password !== password) {
    throw new Error("Wrong password");
  }

  lobby.users.push(lobbyUser);

  return lobby;
}

export function kickUserFromLobby(
  lobbyId: number,
  ip: string
): LobbyPrivate | null {
  const lobby = getLobby(lobbyId);

  lobby.users = lobby.users.filter((user) => user.ip !== ip);

  if (lobby.users.length === 0) {
    lobbyStore.delete(lobbyId);
    return null;
  }

  return lobby;
}

export function kickUserFromAllLobbies(ip: string): LobbyPrivate | null {
  for (const storeItem of lobbyStore) {
    const [key, lobby] = storeItem;

    if (lobby.users.find((user) => user.ip === ip)) {
      lobby.users = lobby.users.filter((user) => user.ip !== ip);

      if (lobby.users.length === 0) {
        lobbyStore.delete(key);
        return null;
      }

      return lobby;
    }
  }

  return null;
}
