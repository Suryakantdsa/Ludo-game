import { PLAYERS, STATE } from "./constants";
import { PlayerID, GameState } from "./interfaces";
import { UI } from "./UI";

export class Ludo {
  // Current positions for each player's pieces
  private currentPositions: {
    [K in PlayerID]: number[];
  } = {
    P1: [],
    P2: [],
  };

  // Dice value with getter and setter
  private _diceValue: number | null = null;
  get diceValue(): number | null {
    return this._diceValue;
  }
  set diceValue(value: number) {
    this._diceValue = value;
    UI.setDiceValue(value);
  }

  // Turn with getter and setter
  private _turn: number | null = null;
  get turn(): number | null {
    return this._turn;
  }
  set turn(value: number) {
    this._turn = value;
    UI.setTurn(value as any);
  }

  // Game state with getter and setter
  private _state: GameState = STATE.DICE_NOT_ROLLED;
  get state(): GameState {
    return this._state;
  }
  set state(value: GameState) {
    this._state = value;
    if (value === STATE.DICE_NOT_ROLLED) {
      UI.enableDice();
    } else {
      UI.disableDice();
    }
  }

  constructor() {
    console.log("Let's play ludo");
    this._turn = 1;
    UI.setTurn(0);
  }
}
