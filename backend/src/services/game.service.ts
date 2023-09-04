export type GameGridValue = -1 | 0 | 1;

export type GameGrid = {
  value: GameGridValue;
  ownerIp?: string;
};

export type Game = {
  id: number;
  grid: GameGrid[][];
};

const gameList = new Map<number, Game>();
let gameId = 100;

function createGrid(size = 3) {
  const res: Game["grid"] = [];

  for (let i = 0; i < size; i++) {
    const row: GameGrid[] = [];

    for (let j = 0; j < size; j++) {
      const obj: GameGrid = { value: -1 };
      row.push(obj);
    }

    res.push(row);
  }

  return res;
}

export function initGame(): Game {
  const game: Game = {
    id: gameId,
    grid: createGrid(3),
  };

  gameList.set(gameId, game);
  gameId += 1;

  return game;
}

export function hasGame(gameId: number) {
  return gameList.has(gameId);
}

export function getGame(gameId: number): Game {
  if (!gameList.has(gameId)) {
    throw new Error("Game not found");
  }
  return gameList.get(gameId) as Game;
}

export function cellsIsFilled(gameId: number): boolean {
  const game = getGame(gameId).grid;

  for (let i = 0; i < game.length; i++) {
    for (let j = 0; j < game[i].length; j++) {
      if (game[i][j].value === -1) {
        return false;
      }
    }
  }

  return true;
}

export function getWinnerIp(gameId: number): string | undefined {
  const gameGrid = getGame(gameId).grid;

  for (let i = 0; i < gameGrid.length; i++) {
    if (
      gameGrid[i][0].value === gameGrid[i][1].value &&
      gameGrid[i][1].value === gameGrid[i][2].value &&
      gameGrid[i][2].value !== -1
    ) {
      return gameGrid[i][0].ownerIp;
    }
  }

  for (let i = 0; i < gameGrid.length; i++) {
    if (
      gameGrid[0][i].value === gameGrid[1][i].value &&
      gameGrid[1][i].value === gameGrid[2][i].value &&
      gameGrid[2][i].value !== -1
    ) {
      return gameGrid[0][i].ownerIp;
    }
  }

  if (
    gameGrid[0][0].value === gameGrid[1][1].value &&
    gameGrid[1][1].value === gameGrid[2][2].value &&
    gameGrid[2][2].value !== -1
  ) {
    return gameGrid[0][0].ownerIp;
  }

  if (
    gameGrid[0][2].value === gameGrid[1][1].value &&
    gameGrid[1][1].value === gameGrid[2][0].value &&
    gameGrid[2][0].value !== -1
  ) {
    return gameGrid[0][2].ownerIp;
  }

  return "";
}

export function canMakeStep(gameId: number, i: number, j: number): boolean {
  const gameGrid = getGame(gameId).grid;

  return gameGrid[i][j].value === -1;
}

// FIXME fix 5 shit
export function makeGameStep(
  gameId: number,
  i: number,
  j: number,
  isCross: boolean,
  ownerIp: string
): Game {
  const pastGame = getGame(gameId);

  pastGame.grid[i][j].value = isCross ? 1 : 0;
  pastGame.grid[i][j].ownerIp = ownerIp;

  return pastGame;
}

export function removeGame(gameId: number) {
  const findedGame = getGame(gameId);

  gameList.delete(findedGame.id);
}

export function _test_restartGame(gameId: number) {
  const findedGame = getGame(gameId);

  findedGame.grid = createGrid(3);
}
