import express from "express";
import http from "http";
import WebSocket from "ws";
import {
  createUser,
  getSafeUser,
  getUser,
  hasUser,
  setIsOffline,
  setIsOnline,
  toSafeUser,
} from "./services/user.service";
import {
  createLobby,
  getLobby,
  getSafeLobbies,
  joinLobby,
  kickUserFromAllLobbies,
  kickUserFromLobby,
} from "./services/lobby.service";
import { checkValidation } from "./services/validation.service";
import {
  canMakeStep,
  getWinnerIp,
  initGame,
  cellsIsFilled,
  makeGameStep,
} from "./services/game.service";
import { SocketMessage, WSM } from "./common";
import { DBInstance } from "./services/db.service";

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const msg = (type: WSM, data: unknown = null) => JSON.stringify({ type, data });

function getMessageFromError(error: any): string {
  return (error as Error).message;
}

async function authHandler(ws: WebSocket, ip: string, name: string) {
  try {
    checkValidation("userName", name);
    const user = await createUser(ip, name, ws.send.bind(ws));

    ws.send(msg(WSM.USER, toSafeUser(user)));
    ws.send(msg(WSM.LOBBY, getSafeLobbies()));
    ws.send(msg(WSM.STATUS, true));
  } catch (error) {
    ws.send(msg(WSM.AUTH_ERROR, getMessageFromError(error)));
  }
}

async function lobbyCreateHandler(
  ws: WebSocket,
  ip: string,
  name: string,
  password: string
) {
  try {
    checkValidation("lobbyName", name);
    checkValidation("lobbyPassword", password);
    const user = await getUser(ip);
    const lobby = createLobby(name, password, user);

    wss.clients.forEach((client: WebSocket) =>
      client.send(msg(WSM.LOBBY, getSafeLobbies()))
    );
    ws.send(msg(WSM.LOBBY_IN, lobby.id));
  } catch (error) {
    console.log({error});

    ws.send(msg(WSM.LOBBY_CREATE_ERROR, getMessageFromError(error)));
  }
}

async function lobbyInHandler(
  ws: WebSocket,
  ip: string,
  id: number,
  password: string
) {
  try {
    checkValidation("lobbyPassword", password);
    const user = await getUser(ip);
    let lobby = getLobby(id);
    if (lobby.status === "end") {
      throw new Error("Game is end");
    }
    if (lobby.status === "process") {
      throw new Error("Game is started");
    }
    lobby = joinLobby(id, password, user);
    wss.clients.forEach((client) =>
      client.send(msg(WSM.LOBBY, getSafeLobbies()))
    );
    ws.send(msg(WSM.LOBBY_IN, id));
    if (lobby.users.length === 2) {
      lobby.send(msg(WSM.GAME_INIT, lobby.id));
    }
  } catch (error) {
    ws.send(msg(WSM.LOBBY_IN_ERROR, getMessageFromError(error)));
  }
}

function lobbyOutHandler(ws: WebSocket, ip: string, lobbyId: number) {
  try {
    const lobby = kickUserFromLobby(lobbyId, ip);
    if (lobby !== null) {
      lobby.send(msg(WSM.GAME_INIT_NOT));
    }
    wss.clients.forEach((client) =>
      client.send(msg(WSM.LOBBY, getSafeLobbies()))
    );
    ws.send(msg(WSM.LOBBY_OUT));
  } catch (error) {
    ws.send(msg(WSM.LOBBY_OUT_ERROR, getMessageFromError(error)));
  }
}

function userReadyHandler(ws: WebSocket, ip: string, lobbyId: number) {
  try {
    const lobby = getLobby(lobbyId);

    lobby.users.forEach((user) => {
      if (user.ip === ip) {
        user.isReady = true;
      }
    });

    ws.send(msg(WSM.GAME_INIT_NOT));

    if (lobby.users.every((user) => user.isReady)) {
      const game = initGame();

      lobby.gameId = game.id;
      lobby.send(msg(WSM.GAME_START, game.grid))
      lobby.status = "process";

      const user = lobby.users.find((user) => user.isHost);

      if (user !== undefined) {
        user.isPlay = true;
      }
    }

    wss.clients.forEach((client) =>
      client.send(msg(WSM.LOBBY, getSafeLobbies()))
    );
  } catch (error) {
    ws.send(msg(WSM.GAME_READY_ERROR, getMessageFromError(error)));
  }
}

// TODO need refactor, hard to read
function userStepHandler(
  ws: WebSocket,
  ip: string,
  lobbyId: number,
  i: number,
  j: number
) {
  try {
    const lobby = getLobby(lobbyId);
    const user = lobby.users.find((u) => u.ip === ip);
    if (user === undefined) {
      throw new Error("user not found");
    }
    if (!user.isPlay) {
      return;
    }
    if (!canMakeStep(lobby.gameId, i, j)) {
      return;
    }

    const game = makeGameStep(lobby.gameId, i, j, user.isHost, ip);
    const isEnd = cellsIsFilled(lobby.gameId);
    const winnerIp = getWinnerIp(lobby.gameId);

    if (isEnd || winnerIp !== "") {
      lobby.status = "end";
      lobby.users.forEach((u) => {
        u.isPlay = false;
        u.send(msg(WSM.GAME, game));
      });
      if (winnerIp === "") {
        lobby.users.forEach((u) => {
          u.draw += 1;
          u.send(msg(WSM.GAME_END, 0));
        });
      } else {
        lobby.users.forEach((u) => {
          const isWin = winnerIp === u.ip;
          if (isWin) u.win += 1;
          else u.lose += 1;
          u.send(msg(WSM.GAME_END, isWin ? 1 : -1));
        });
        // lobby.users.forEach((u) => userSync(u.ip))
      }
      lobby.users.forEach((u) => {
        u.send(msg(WSM.USER, toSafeUser(u)));
      });
    } else {
      lobby.users.forEach((u) => {
        u.isPlay = !u.isPlay;
      });
      lobby.send(msg(WSM.GAME, game));
    }
    wss.clients.forEach(c => c.send(msg(WSM.LOBBY, getSafeLobbies())))
  } catch (error) {
    console.log("ERROR, ", error);
    ws.send(msg(WSM.GAME_STEP_ERROR, getMessageFromError(error)));
  }
}

function socketMessageHandler(ws: WebSocket, ip: string) {
  return function (message: WebSocket.RawData) {
    const parsedMessage: SocketMessage = JSON.parse(message.toString());
    const d = parsedMessage.data;

    switch (parsedMessage.type) {
      case WSM.AUTH: {
        authHandler(ws, ip, d);
        break;
      }
      case WSM.LOBBY_CREATE: {
        lobbyCreateHandler(ws, ip, d.name, d.password);
        break;
      }
      case WSM.LOBBY_IN: {
        lobbyInHandler(ws, ip, d.id, d.password);
        break;
      }
      case WSM.LOBBY_OUT: {
        lobbyOutHandler(ws, ip, d);
        break;
      }
      case WSM.GAME_READY: {
        userReadyHandler(ws, ip, d);
        break;
      }
      case WSM.GAME_STEP: {
        userStepHandler(ws, ip, d.lobbyId, d.i, d.j);
        break;
      }
      default: {
        break;
      }
    }
  };
}

wss.on("connection", async (ws: WebSocket, req) => {
  const ip = `${req.socket.remoteAddress}:${req.socket.remotePort}`;
  // const ip = `${req.socket.remoteAddress}`;

  if (await hasUser(ip)) {
    setIsOnline(ip, ws.send.bind(ws));
    ws.send(msg(WSM.USER, getSafeUser(ip)));
    ws.send(msg(WSM.LOBBY, getSafeLobbies()));
    ws.send(msg(WSM.STATUS, true));
  } else {
    ws.send(msg(WSM.STATUS, false));
  }

  ws.on("message", socketMessageHandler(ws, ip));

  ws.on("close", async () => {
    if (await hasUser(ip)) {
      setIsOffline(ip);
      const lobby = kickUserFromAllLobbies(ip);
      if (lobby !== null) {
        lobby.users.forEach((user) => user.send(msg(WSM.GAME_INIT_NOT)));
      }
      wss.clients.forEach((c) => c.send(msg(WSM.LOBBY, getSafeLobbies())));
    }
  });
});

app.get("/", (_, res) => {
  res.send("Hello World! 1");
});

DBInstance.initialize().then(() => {
  server.listen(8080, () => {
    console.log("Express WebSocket server is running on port 8080");
  });
});
