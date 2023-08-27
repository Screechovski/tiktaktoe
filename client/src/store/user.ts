import { get, writable } from "svelte/store";
import { authError, authName } from "./auth";

export interface User {
  id: number;
  name: string;
  win: number;
  lose: number;
  draw: number;
  emoji: string;
}

export type UserLobby = User & {
  isReady: boolean;
  isHost: boolean;
  isPlay: boolean;
}

export const user = writable<User>({
  id: -1,
  emoji: "",
  name: "",
  win: 0,
  lose: 0,
  draw: 0
})

export function setUser(d: User){
  user.set(d);
  authName.set("")
  authError.set("")
}

export function isMe(id: number): boolean
export function isMe(user: User): boolean
export function isMe(val: number | User): boolean {
  if (typeof val === "number") {
    return get(user).id === val;
  }
  return val.id === get(user).id
}

export function userReset(){
  user.set({
    id: -1,
    emoji: "",
    name: "",
    win: 0,
    lose: 0,
    draw: 0
  })
}