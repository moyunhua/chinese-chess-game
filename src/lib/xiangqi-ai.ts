import { Piece, Position, Player, Move, PieceType } from './xiangqi-types';
import { getValidMoves, makeMove, isInCheck, isCheckmate } from './xiangqi-rules';

const PIECE_VALUES: Record<PieceType, number> = {
  king: 10000,
  advisor: 200,
  elephant: 200,
  horse: 400,
  chariot: 900,
  cannon: 450,
  soldier: 100
};

export function evaluateBoard(board: (Piece | null)[][], player: Player): number {
  let score = 0;
  
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 9; col++) {
      const piece = board[row][col];
      if (piece) {
        let pieceValue = PIECE_VALUES[piece.type];
        
        if (piece.type === 'soldier') {
          const crossedRiver = piece.player === 'red' ? row <= 4 : row >= 5;
          if (crossedRiver) pieceValue *= 2;
        }
        
        if (piece.player === player) {
          score += pieceValue;
        } else {
          score -= pieceValue;
        }
      }
    }
  }
  
  if (isInCheck(board, player)) score -= 500;
  if (isInCheck(board, player === 'red' ? 'black' : 'red')) score += 500;
  
  return score;
}

export function getAllMoves(board: (Piece | null)[][], player: Player): Move[] {
  const moves: Move[] = [];
  
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 9; col++) {
      const piece = board[row][col];
      if (piece && piece.player === player) {
        const validMoves = getValidMoves(board, piece, { row, col });
        for (const to of validMoves) {
          moves.push({
            from: { row, col },
            to,
            piece,
            captured: board[to.row][to.col] || undefined
          });
        }
      }
    }
  }
  
  return moves;
}

export function minimax(
  board: (Piece | null)[][],
  depth: number,
  isMaximizing: boolean,
  player: Player,
  alpha: number = -Infinity,
  beta: number = Infinity
): { score: number; move?: Move } {
  if (depth === 0) {
    return { score: evaluateBoard(board, player) };
  }
  
  const currentPlayer = isMaximizing ? player : (player === 'red' ? 'black' : 'red');
  const moves = getAllMoves(board, currentPlayer);
  
  if (moves.length === 0) {
    if (isCheckmate(board, currentPlayer)) {
      return { score: isMaximizing ? -Infinity : Infinity };
    }
    return { score: evaluateBoard(board, player) };
  }
  
  let bestMove: Move | undefined;
  
  if (isMaximizing) {
    let maxScore = -Infinity;
    for (const move of moves) {
      const newBoard = makeMove(board, move.from, move.to);
      if (!isInCheck(newBoard, currentPlayer)) {
        const result = minimax(newBoard, depth - 1, false, player, alpha, beta);
        if (result.score > maxScore) {
          maxScore = result.score;
          bestMove = move;
        }
        alpha = Math.max(alpha, maxScore);
        if (beta <= alpha) break;
      }
    }
    return { score: maxScore, move: bestMove };
  } else {
    let minScore = Infinity;
    for (const move of moves) {
      const newBoard = makeMove(board, move.from, move.to);
      if (!isInCheck(newBoard, currentPlayer)) {
        const result = minimax(newBoard, depth - 1, true, player, alpha, beta);
        if (result.score < minScore) {
          minScore = result.score;
          bestMove = move;
        }
        beta = Math.min(beta, minScore);
        if (beta <= alpha) break;
      }
    }
    return { score: minScore, move: bestMove };
  }
}

export function getBestMove(board: (Piece | null)[][], player: Player, difficulty: number = 3): Move | null {
  const depth = Math.max(1, Math.min(4, difficulty));
  const result = minimax(board, depth, true, player);
  return result.move || null;
}