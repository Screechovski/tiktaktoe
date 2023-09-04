export enum WSM {
  STATUS = "WS_STATUS",
  AUTH = "WS_AUTH",
  AUTH_ERROR = "WS_AUTH_ERROR",
  USER = "WS_USER",
  LOBBY = "WS_LOBBY",
  LOBBY_CREATE = "WS_LOBBY_CREATE",
  LOBBY_CREATE_ERROR = "WS_LOBBY_CREATE_ERROR",
  LOBBY_IN = "WS_LOBBY_IN",
  LOBBY_IN_ERROR = "WS_LOBBY_IN_ERROR",
  LOBBY_OUT = "WS_LOBBY_OUT",
  LOBBY_OUT_ERROR = "WS_LOBBY_OUT_ERROR",
  GAME = "WS_GAME",
  GAME_INIT = "WS_GAME_INIT",
  GAME_INIT_NOT = "WS_GAME_INIT_NOT",
  GAME_READY = "WS_GAME_READY",
  GAME_READY_ERROR = "WS_GAME_READY_ERROR",
  GAME_START = "GAME_START",
  GAME_STEP = "WS_GAME_STEP",
  GAME_STEP_ERROR = "WS_GAME_STEP_ERROR",
  GAME_END = "WS_GAME_END",
}

export interface SocketMessage<T = any> {
  type: WSM;
  data: T;
}

export enum GameStatus {
  DRAW = "GAME_DRAW",
  CROSSES = "GAME_WIN_CROSSES",
  ZEROES = "GAME_WIN_ZEROES",
  CONTINUES = "GAME_CONTINUES",
}

type ValidationNode = {
  min: number;
  max: number;
  regex: RegExp;
};

export const validationKeys = [
  "userName",
  "lobbyName",
  "lobbyPassword",
] as const;

type Validation = {
  [key in (typeof validationKeys)[number]]: ValidationNode;
};

export const validation: Validation = {
  userName: {
    min: 3,
    max: 15,
    regex: /[^a-zа-я-0-9 ]/gi,
  },
  lobbyName: {
    min: 3,
    max: 20,
    regex: /[^a-zа-я-0-9 ]/gi,
  },
  lobbyPassword: {
    min: 0,
    max: 10,
    regex: /[^a-z0-9]/gi,
  },
};

const test = "12____3456";
