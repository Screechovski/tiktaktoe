import { writable } from "svelte/store";

export const isLogined = writable<boolean>(false)

export function setIsLogined(flag: boolean){
  isLogined.set(flag)
}

export function rootReset(){
  isLogined.set(false);
}