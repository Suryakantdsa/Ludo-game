// For COORDINATES_MAP
export type CoordinatesMap = {
  [key: number]: [number, number];
};

// For PLAYERS
export type PlayerID = "P1" | "P2";

// For BASE_POSITIONS
export type BasePositions = {
  [key in PlayerID]: number[];
};

// For START_POSITIONS
export type StartPositions = {
  [key in PlayerID]: number;
};

// For HOME_ENTRANCE
export type HomeEntrance = {
  [key in PlayerID]: number[];
};

// For HOME_POSITIONS
export type HomePositions = {
  [key in PlayerID]: number;
};

// For TURNING_POINTS
export type TurningPoints = {
  [key in PlayerID]: number;
};

// For STATE
export type GameState = "DICE_NOT_ROLLED" | "DICE_ROLLED";

// Combined game constants interface
export interface GameConstants {
  COORDINATES_MAP: CoordinatesMap;
  STEP_LENGTH: number;
  PLAYERS: PlayerID[];
  BASE_POSITIONS: BasePositions;
  START_POSITIONS: StartPositions;
  HOME_ENTRANCE: HomeEntrance;
  HOME_POSITIONS: HomePositions;
  TURNING_POINTS: TurningPoints;
  SAFE_POSITIONS: number[];
  STATE: {
    DICE_NOT_ROLLED: GameState;
    DICE_ROLLED: GameState;
  };
}
