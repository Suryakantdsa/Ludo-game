import {
  BASE_POSITIONS,
  HOME_ENTRANCE,
  HOME_POSITIONS,
  PLAYERS,
  SAFE_POSITIONS,
  START_POSITIONS,
  STATE,
  TURNING_POINTS,
} from "./constants";
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
  private _turn: number = 0;
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
      UI.unhighlightPiece();
    } else {
      UI.disableDice();
    }
  }

  constructor() {
    console.log("Let's play ludo");
    // this._turn = 1;
    // UI.setTurn(0);
    this.listenDiceClick();
    this.listenResetCLick();
    this.listenPieceClick();
    this.resetGame();

    //check won senario
    // this.sePiecePosition("P1", 0, HOME_ENTRANCE.P1[4]);
    // this.sePiecePosition("P1", 1, HOME_POSITIONS.P1);
    // this.sePiecePosition("P1", 2, HOME_POSITIONS.P1);
    // this.sePiecePosition("P1", 3, HOME_POSITIONS.P1);

    // check is kill
    this.sePiecePosition("P1", 0, 0);
    this.sePiecePosition("P2", 0, 1);

    // this.diceValue = 6;
    // console.log(this.getEligiblePieces("P1"));
    // // this.sePiecePosition("P2", 0, 38);
  }
  listenDiceClick() {
    UI.listenDiceClick(this.onDiceClick.bind(this));
  }
  onDiceClick() {
    console.log("dice click", this.turn);

    this.diceValue = 1; //Math.floor(Math.random() * 7);
    this.state = STATE.DICE_ROLLED;
    this.checkForEligiblePieces();
  }

  checkForEligiblePieces() {
    // if (this.turn) {
    const player = PLAYERS[this.turn as any];
    const eligiblePieces = this.getEligiblePieces(player);
    console.log(eligiblePieces);
    if (eligiblePieces.length) {
      UI.highlightPieces(player, eligiblePieces);
    } else {
      this.incrementTurn();
    }
    // }
  }
  getEligiblePieces(player: PlayerID) {
    return [0, 1, 2, 3].filter((piece) => {
      const curentPos = this.currentPositions[player][piece];
      if (curentPos === HOME_POSITIONS[player]) {
        return false;
      }
      if (BASE_POSITIONS[player].includes(curentPos) && this.diceValue !== 6) {
        return false;
      }
      if (
        HOME_ENTRANCE[player].includes(curentPos) &&
        this.diceValue &&
        this.diceValue > HOME_POSITIONS[player] - curentPos
      ) {
        return false;
      }
      return true;
    });
  }

  incrementTurn() {
    this.turn = this.turn === 0 ? 1 : 0;
    this.state = STATE.DICE_NOT_ROLLED;
  }

  listenResetCLick() {
    UI.listenResetClick(this.resetGame.bind(this));
  }
  resetGame() {
    console.log("reset game");
    this.currentPositions = structuredClone(BASE_POSITIONS);

    PLAYERS.forEach((player) => {
      [0, 1, 2, 3].forEach((piece) => {
        this.sePiecePosition(
          player,
          piece,
          this.currentPositions[player][piece]
        );
      });
    });
    this.turn = 0;
    this.state = STATE.DICE_NOT_ROLLED;
  }

  listenPieceClick() {
    UI.listenPlayerPieceClick(this.onPieceClick.bind(this));
  }
  onPieceClick(event: Event) {
    const target = event.target as HTMLElement;

    if (!target.classList.contains("player-piece")) {
      console.log("clicked wrong place");
      return;
    }
    const player = target.getAttribute("player-id");
    const piece = target.getAttribute("piece");
    if (player && piece) {
      this.handlePieceClick(player as PlayerID, Number(piece));
    }
  }
  handlePieceClick(player: PlayerID, piece: number) {
    console.log(player, piece);
    // this.movePiece(player, piece, 5);
    const curentPos = this.currentPositions[player][piece];

    if (BASE_POSITIONS[player].includes(curentPos)) {
      this.sePiecePosition(player, piece, START_POSITIONS[player]);
      this.state = STATE.DICE_NOT_ROLLED;
      return;
    }
    UI.unhighlightPiece();
    if (this.diceValue) {
      this.movePiece(player, piece, this.diceValue);
    }
  }
  sePiecePosition(player: PlayerID, piece: number, newPosition: number) {
    this.currentPositions[player][piece] = newPosition;
    UI.setPiecePostion(player, piece, newPosition);
  }
  movePiece(player: PlayerID, piece: number, moveBy: number) {
    // this.sePiecePosition(
    //   player,
    //   piece,
    //   this.currentPositions[player][piece] + moveBy
    // );

    const interval = setInterval(() => {
      this.incrementPiecePosition(player, piece);
      moveBy--;
      if (moveBy === 0) {
        clearInterval(interval);
        //check if player won the match
        console.log(this.hasPlayerWon(player));
        console.log(this.currentPositions[player]);
        if (this.hasPlayerWon(player)) {
          alert(`player ${player} won !!`);
          this.resetGame();
          return;
        }
        const isKill = this.checkilled(player, piece);
        if (isKill || this.diceValue === 6) {
          this.state = STATE.DICE_NOT_ROLLED;
          return;
        }

        this.incrementTurn();
      }
    }, 200);
  }
  checkilled(player: PlayerID, piece: number) {
    const curentPos = this.currentPositions[player][piece];
    const opponent = player === "P1" ? "P2" : "P1";
    let kill = false;
    [0, 1, 2, 3].forEach((piece) => {
      const opponentPos = this.currentPositions[opponent][piece];
      if (curentPos === opponentPos && !SAFE_POSITIONS.includes(curentPos)) {
        this.sePiecePosition(opponent, piece, BASE_POSITIONS[opponent][piece]);
        kill = true;
      }
    });
    return kill;
  }
  hasPlayerWon(player: PlayerID) {
    return [0, 1, 2, 3].every(
      (piece) => this.currentPositions[player][piece] === HOME_POSITIONS[player]
    );
  }
  incrementPiecePosition(player: PlayerID, piece: number) {
    this.sePiecePosition(
      player,
      piece,
      this.getincrementPiecePosition(player, piece)
    );
  }
  getincrementPiecePosition(player: PlayerID, piece: number) {
    const curentPos = this.currentPositions[player][piece];

    if (curentPos === TURNING_POINTS[player]) {
      return HOME_ENTRANCE[player][0];
    } else if (curentPos === 51) {
      return 0;
    } else {
      return curentPos + 1;
    }
  }
}
