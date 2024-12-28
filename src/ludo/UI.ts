import { COORDINATES_MAP, PLAYERS, STEP_LENGTH } from "./constants";
import { PlayerID } from "./interfaces";

const resetButtonElement = document.querySelector("#reset-btn");
const playerPieceElement = document.querySelector(".player-pieces");
const diceButtonElement = document.querySelector("#dice-btn");

const playerPieceElements: { [key in PlayerID]: NodeListOf<HTMLElement> } = {
  P1: document.querySelectorAll(`[player-id="P1"].player-piece`),
  P2: document.querySelectorAll(`[player-id="P2"].player-piece`),
};

type ClickCallback = (event: Event) => void;

export class UI {
  //   private static COORDINATES_MAP: CoordinatesMap;

  static listenDiceClick(callback: ClickCallback) {
    diceButtonElement?.addEventListener("click", callback);
  }
  static listenResetClick(callback: ClickCallback) {
    resetButtonElement?.addEventListener("click", callback);
  }
  static listenPlayerPieceClick(callback: ClickCallback) {
    playerPieceElement?.addEventListener("click", callback);
  }
  /**
   * Description
   * @author Suryakant das
   * @date 2024-12-28
   * @param {string} player
   * @param {number} piece
   * @param {keyof COORDINATES_MAP } newPosition
   * @returns {any}
   */

  static setPiecePostion(
    player: PlayerID,
    piece: number,
    newPosition: number
  ): void {
    console.log(player, piece, newPosition);
    if (!playerPieceElements[player] || !playerPieceElements[player][piece]) {
      console.error(
        `player element of given player ${player} and ${piece} is not found`
      );
    }

    const [x, y] = COORDINATES_MAP[newPosition as keyof typeof COORDINATES_MAP];
    const pieceElement = playerPieceElements[player][piece];

    pieceElement.style.top = y * STEP_LENGTH + "%";
    pieceElement.style.left = x * STEP_LENGTH + "%";
  }

  static setTurn(index: number) {
    if (index < 0 || index >= PLAYERS.length) {
      console.error("index is out of bound");
      return;
    }

    const player = PLAYERS[index];
    // display the player name
    const activePlayer = document.querySelector(
      ".active-player span"
    ) as HTMLElement;
    activePlayer.innerText = player;
    //hightlight the base of player
    const baseOfActivePlayer = document.querySelector(".player-base.highlight");
    if (baseOfActivePlayer) {
      baseOfActivePlayer.classList.remove("highlight");
    }
    document
      .querySelector(`[player-id=${player}].player-base`)
      ?.classList.add("highlight");
  }

  static enableDice() {
    diceButtonElement?.removeAttribute("disabled");
  }

  static disableDice() {
    diceButtonElement?.setAttribute("disabled", "");
  }

  static highlightPieces(player: PlayerID, pieces: number[]) {
    console.log(pieces);
    pieces.forEach((piece) => {
      const pieceElement = playerPieceElements[player][piece];
      pieceElement.classList.add("highlight");
    });
  }

  static unhighlightPiece() {
    document.querySelectorAll(".player-piece.highlight").forEach((ele) => {
      ele.classList.remove("highlight");
    });
  }
  static setDiceValue(value: number) {
    const diceValueElement = document.querySelector(
      ".dice-value"
    ) as HTMLElement;
    diceValueElement.innerText = String(value);
  }
}
