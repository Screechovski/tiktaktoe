import {
  GameGrid,
  _test_restartGame,
  canMakeStep,
  cellsIsFilled,
  getGame,
  getWinnerIp,
  hasGame,
  initGame,
  makeGameStep,
  removeGame,
} from "../../services/game.service";

function createGrid(v: GameGrid = { value: -1 }, n = 3) {
  const a: GameGrid[][] = [[]];

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (!a[i]) {
        a[i] = [];
      }
      a[i][j] = v;
    }
  }

  return a;
}

it("init game", () => {
  const initedGame = initGame();

  expect(initedGame.grid).toEqual(createGrid());
  expect(hasGame(initedGame.id)).toBeTruthy();
  expect(getGame(initedGame.id)).toEqual(initedGame);
});

it("game doesnt exist exeption", () => {
  try {
    const game = getGame(101);

    expect(game).toEqual(2);
  } catch (error) {
    expect(error).toBeInstanceOf(Error);
  }
});

it("fill cells", () => {
  const initedGame = initGame();

  expect(cellsIsFilled(initedGame.id)).toBeFalsy();

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      expect(canMakeStep(initedGame.id, i, j)).toBeTruthy();
      makeGameStep(initedGame.id, i, j, true, "ip");
      expect(canMakeStep(initedGame.id, i, j)).toBeFalsy();
    }
  }

  expect(initedGame.grid).toEqual(createGrid({ value: 1, ownerIp: "ip" }));
  expect(cellsIsFilled(initedGame.id)).toBeTruthy();
});

describe("test end game", () => {
  describe("win", () => {
    it("diagonals", () => {
      const initedGame = initGame();
      const ip = "ip";

      for (let i = 0; i < 3; i++) {
        expect(getWinnerIp(initedGame.id)).toEqual("");

        makeGameStep(initedGame.id, i, i, true, ip);
      }

      expect(getWinnerIp(initedGame.id)).toEqual(ip);

      _test_restartGame(initedGame.id);

      for (let i = 0; i < 3; i++) {
        expect(getWinnerIp(initedGame.id)).toEqual("");

        makeGameStep(initedGame.id, i, 2 - i, true, ip);
      }

      expect(getWinnerIp(initedGame.id)).toEqual(ip);

      removeGame(initedGame.id);
    });

    it("rows", () => {
      const initedGame = initGame();
      const ip = "ip";

      for (let j = 0; j < 3; j++) {
        for (let i = 0; i < 3; i++) {
          expect(getWinnerIp(initedGame.id)).toEqual("");

          makeGameStep(initedGame.id, i, j, true, ip);
        }

        expect(getWinnerIp(initedGame.id)).toEqual(ip);

        _test_restartGame(initedGame.id);
      }

      removeGame(initedGame.id);
    });

    it("cols", () => {
      const initedGame = initGame();
      const ip = "ip";

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          expect(getWinnerIp(initedGame.id)).toEqual("");

          makeGameStep(initedGame.id, i, j, false, ip);
        }

        expect(getWinnerIp(initedGame.id)).toEqual(ip);

        _test_restartGame(initedGame.id);
      }

      removeGame(initedGame.id);
    });
  });
});
