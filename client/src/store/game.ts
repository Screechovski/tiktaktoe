import { writable } from "svelte/store";

export type Cell = {
  value: number,
  ownerIp: string | null
}

export type GameInstance = Cell[][];
export type GameResult = -1 | 0 | 1

export const showIsReady = writable<boolean>(false);
export const gameIsStarted = writable<boolean>(false);
export const gameInstance  = writable<GameInstance | null>(null)
export const gameIsEnd = writable<boolean>(false);
export const statusGame = writable<GameResult>(0);

export function setGame(grid: Cell[][]){
  gameInstance.set(grid)
}

export function setGameIsStarted(flag: boolean, grid: Cell[][]) {
  gameIsStarted.set(flag);
  setGame(grid)
}

export function setShowIsReady(flag: boolean) {
  showIsReady.set(flag);
}

export function setEndGame(flag: boolean) {
  gameIsEnd.set(flag);
}

export function setStatusGame(result: GameResult) {
  statusGame.set(result);
}

export function gameReset(){
  showIsReady.set(false)
  gameIsStarted.set(false)
  gameInstance.set(null)
  gameIsEnd.set(false)
  statusGame.set(0)
}
