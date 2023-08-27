type ValidationNode = {
  min: number;
  max: number;
  regex: RegExp;
}

export const validationKeys = ["userName", "lobbyName", "lobbyPassword"] as const;

type Validation = {
  [key in typeof validationKeys[number]]: ValidationNode
}

export const validation: Validation = {
  userName:  {
    min: 3,
    max: 15,
    regex: /[^a-zа-я-0-9 ]/gi
  },
  lobbyName: {
    min: 3,
    max: 20,
    regex: /[^a-zа-я-0-9 ]/gi
  },
  lobbyPassword: {
    min: 0,
    max: 10,
    regex: /[^a-z0-9]/gi
  }
}