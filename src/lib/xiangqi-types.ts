export type PieceType = 'king' | 'advisor' | 'elephant' | 'horse' | 'chariot' | 'cannon' | 'soldier';
export type Player = 'red' | 'black';

export interface Piece {
  type: PieceType;
  player: Player;
}

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  from: Position;
  to: Position;
  piece: Piece;
  captured?: Piece;
}

export interface GameState {
  board: (Piece | null)[][];
  currentPlayer: Player;
  selectedPosition: Position | null;
  validMoves: Position[];
  moveHistory: Move[];
  gameOver: boolean;
  winner: Player | null;
  inCheck: boolean;
}

export const PIECE_SYMBOLS: Record<PieceType, Record<Player, string>> = {
  king: { red: '帥', black: '將' },
  advisor: { red: '仕', black: '士' },
  elephant: { red: '相', black: '象' },
  horse: { red: '馬', black: '馬' },
  chariot: { red: '車', black: '車' },
  cannon: { red: '炮', black: '砲' },
  soldier: { red: '兵', black: '卒' }
};

export const initialBoard: (Piece | null)[][] = [
  [
    { type: 'chariot', player: 'black' },
    { type: 'horse', player: 'black' },
    { type: 'elephant', player: 'black' },
    { type: 'advisor', player: 'black' },
    { type: 'king', player: 'black' },
    { type: 'advisor', player: 'black' },
    { type: 'elephant', player: 'black' },
    { type: 'horse', player: 'black' },
    { type: 'chariot', player: 'black' }
  ],
  [null, null, null, null, null, null, null, null, null],
  [null, { type: 'cannon', player: 'black' }, null, null, null, null, null, { type: 'cannon', player: 'black' }, null],
  [{ type: 'soldier', player: 'black' }, null, { type: 'soldier', player: 'black' }, null, { type: 'soldier', player: 'black' }, null, { type: 'soldier', player: 'black' }, null, { type: 'soldier', player: 'black' }],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [{ type: 'soldier', player: 'red' }, null, { type: 'soldier', player: 'red' }, null, { type: 'soldier', player: 'red' }, null, { type: 'soldier', player: 'red' }, null, { type: 'soldier', player: 'red' }],
  [null, { type: 'cannon', player: 'red' }, null, null, null, null, null, { type: 'cannon', player: 'red' }, null],
  [null, null, null, null, null, null, null, null, null],
  [
    { type: 'chariot', player: 'red' },
    { type: 'horse', player: 'red' },
    { type: 'elephant', player: 'red' },
    { type: 'advisor', player: 'red' },
    { type: 'king', player: 'red' },
    { type: 'advisor', player: 'red' },
    { type: 'elephant', player: 'red' },
    { type: 'horse', player: 'red' },
    { type: 'chariot', player: 'red' }
  ]
];