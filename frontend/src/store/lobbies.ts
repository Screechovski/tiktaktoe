import { derived, get, writable, type Readable } from "svelte/store";
import type { UserLobby } from "./user";

export type Lobby = {
  id: number;
  name: string;
  users: UserLobby[];
  isPrivate: boolean;
  status: "waiting" | "process" | "end"
};

type State = {
  list: Lobby[];
  joinIsOpen: boolean;
  joinPassword: string;
  joinError: string;
};

export const lobbies = writable<State>({
  list: [],
  joinIsOpen: false,
  joinPassword: "",
  joinError: "",
});

export const activeLobbyId = writable<number>(-1);

export function setLobbies(list: Lobby[]) {
  lobbies.update((v) => ({
    ...v,
    list,
  }));
}

export function setJoinError(joinError: string) {
  lobbies.update((v) => ({
    ...v,
    joinError,
  }));
}

export function setActiveLobbyId(id: number) {
  activeLobbyId.set(id);
}

export const activeLobby: Readable<Lobby | null> = derived([activeLobbyId, lobbies], ([val, _], set) => {
  if (val === -1) {
    set(null);
    return;
  }

  const lobby = get(lobbies).list.find((l) => l.id === val);

  if (lobby) {
    set(lobby);
  } else {
    set(null);
  }
})

export function lobbiesReset(){
  lobbies.set({
    list: [],
    joinIsOpen: false,
    joinPassword: "",
    joinError: "",
  });

  activeLobbyId.set(-1);
}
