import { derived, get, writable } from "svelte/store";
import { sendLobby } from "./socket";
import { validation } from "../validation";

export const createName = writable<string>("");
export const createPassword = writable<string>("");
export const createError = writable<string>("");

export const createDisabled = derived(
  [createName, createPassword],
  ([$createName, $createPassword]) =>
    $createName.length < validation.lobbyName.min ||
    $createName.length > validation.lobbyName.max ||
    $createPassword.length < validation.lobbyPassword.min ||
    $createPassword.length > validation.lobbyPassword.max
);

createName.subscribe((val) => {
  const cleanValue = val.replace(validation.lobbyName.regex, "");
  createName.set(cleanValue.substring(0, validation.lobbyName.max));
});

createPassword.subscribe((val) => {
  const cleanValue = val.replace(validation.lobbyPassword.regex, "");
  createPassword.set(cleanValue.substring(0, validation.lobbyPassword.max));
});

export function createHandler() {
  sendLobby(get(createName), get(createPassword));
}

export function setCreateError(e: string) {
  createError.set(e);
}

export function menuReset(){
  createName.set("");
  createPassword.set("");
  createError.set("");
}
