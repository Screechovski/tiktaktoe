import { derived, writable, get } from "svelte/store";
import { sendAuth } from "./socket";
import { validation } from "../validation";

export const authName = writable<string>("");
export const authError = writable<string>("");

export const authDisabled = derived(
  authName,
  ($authName: string) =>
    $authName.length < validation.userName.min ||
    $authName.length > validation.userName.max
);

authName.subscribe((val) => {
  const cleanValue = val.replace(validation.userName.regex, "");
  authName.set(cleanValue.substring(0, validation.userName.max));
});

export function authSubmit() {
  sendAuth(get(authName));
}

export function setAuthError(d: string) {
  authError.set(d);
}

export function authReset(){
  authName.set("")
  authError.set("")
}
