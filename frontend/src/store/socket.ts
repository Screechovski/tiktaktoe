import { writable } from "svelte/store";
import { WSM, type SocketMessage } from "../types";
import { rootReset, setIsLogined } from "./root";
import { authReset, setAuthError } from "./auth";
import { setUser, userReset, type User } from "./user";
import { setLobbies, type Lobby, setJoinError, setActiveLobbyId, lobbies, lobbiesReset } from "./lobbies";
import { menuReset, setCreateError } from "./menu";
import { setEndGame, setGame, setGameIsStarted, setStatusGame, setShowIsReady, gameReset, type GameResult } from "./game";

let socket: WebSocket;

export const isConnected = writable<boolean>(false);
export const isLoading = writable<boolean>(false);
export const connectionError = writable<string>("");

function reset(){
  authReset();
  gameReset();
  lobbiesReset();
  menuReset();
  rootReset();
  userReset();
}

export function initSocket() {
  isLoading.set(true);
  connectionError.set("");
  if (socket) {
    socket.close()
    socket = undefined
  }
  socket = new WebSocket("ws://localhost:8080");

  socket.onclose = () => {
    console.log("socket close");
    isLoading.set(false);
    isConnected.set(false);
    reset();
  };

  socket.onerror = () => {
    console.log("socket error");
    isConnected.set(false);
    connectionError.set("Failed to connect to the server");
    reset();
  };

  socket.onopen = () => {
    console.log("socket open");
    isLoading.set(false);
    isConnected.set(true);
  };

  socket.onmessage = (ev) => {
    const parsedData: SocketMessage = JSON.parse(ev.data);

    switch (parsedData.type) {
      case WSM.STATUS: {
        setIsLogined(parsedData.data as boolean);
        break;
      }
      case WSM.AUTH_ERROR: {
        setAuthError(parsedData.data as string);
        break;
      }
      case WSM.USER: {
        setUser(parsedData.data as User);
        break;
      }
      case WSM.LOBBY: {
        setLobbies(parsedData.data as Lobby[]);
        break;
      }
      case WSM.LOBBY_CREATE_ERROR: {
        setCreateError(parsedData.data as string);
        break;
      }
      case WSM.LOBBY_IN_ERROR: {
        setJoinError(parsedData.data as string);
        break;
      }
      case WSM.LOBBY_IN: {
        setActiveLobbyId(parsedData.data as number)
        break;
      }
      case WSM.LOBBY_OUT: {
        setActiveLobbyId(-1)
        break;
      }
      case WSM.GAME_INIT: {
        setShowIsReady(true)
        break;
      }
      case WSM.GAME_INIT_NOT: {
        setShowIsReady(false)
        break;
      }
      case WSM.GAME_START: {
        setGameIsStarted(true, parsedData.data)
        break;
      }
      case WSM.GAME: {
        setGame(parsedData.data.grid)
        break;
      }
      case WSM.GAME_END: {
        setEndGame(true);
        setStatusGame(parsedData.data as GameResult)
        break;
      }
    }
  };
}

export function sendAuth(name: string) {
  if (socket) {
    socket.send(JSON.stringify({ type: WSM.AUTH, data: name }));
    return;
  }
  console.warn("socket is not inited");
}

export function sendLobby(name: string, password: string) {
  if (socket) {
    socket.send(
      JSON.stringify({ type: WSM.LOBBY_CREATE, data: { name, password } })
    );
    return;
  }
  console.warn("socket is not inited");
}

export function joinLobby(id: number, password: string) {
  if (socket) {
    socket.send(JSON.stringify({ type: WSM.LOBBY_IN, data: { id, password } }));
    return;
  }
  console.warn("socket is not inited");
}

export function leaveLobby(id: number){
  if (socket) {
    socket.send(JSON.stringify({ type: WSM.LOBBY_OUT, data: id }));
    return;
  }
  console.warn("socket is not inited");
}

export function sendReady(id: number){
  if (socket) {
    socket.send(JSON.stringify({ type: WSM.GAME_READY, data: id }));
    return;
  }
  console.warn("socket is not inited");
}

export function makeStep(lobbyId: number, i: number, j: number){
  if (socket) {
    socket.send(JSON.stringify({ type: WSM.GAME_STEP, data: { lobbyId, i, j } }));
    return;
  }
  console.warn("socket is not inited");
}
