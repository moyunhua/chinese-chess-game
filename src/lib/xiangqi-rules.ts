import { Piece, Position, Player, PieceType, Move } from './xiangqi-types';

export function isValidPosition(pos: Position): boolean {
  return pos.row >= 0 && pos.row < 10 && pos.col >= 0 && pos.col < 9;
}

export function inPalace(pos: Position, player: Player): boolean {
  const { row, col } = pos;
  if (player === 'red') {
    return row >= 7 && row <= 9 && col >= 3 && col <= 5;
  } else {
    return row >= 0 && row <= 2 && col >= 3 && col <= 5;
  }
}

export function onSameSide(pos: Position, player: Player): boolean {
  if (player === 'red') {
    return pos.row >= 5;
  } else {
    return pos.row <= 4;
  }
}

export function hasLineOfSight(board: (Piece | null)[][], from: Position, to: Position): boolean {
  const rowDiff = Math.abs(to.row - from.row);
  const colDiff = Math.abs(to.col - from.col);
  
  if (rowDiff === 0 && colDiff === 0) return false;
  
  if (rowDiff > 0 && colDiff > 0) return false;
  
  const rowStep = rowDiff === 0 ? 0 : (to.row - from.row) / rowDiff;
  const colStep = colDiff === 0 ? 0 : (to.col - from.col) / colDiff;
  
  let currentRow = from.row + rowStep;
  let currentCol = from.col + colStep;
  
  while (currentRow !== to.row || currentCol !== to.col) {
    if (board[currentRow][currentCol] !== null) {
      return false;
    }
    currentRow += rowStep;
    currentCol += colStep;
  }
  
  return true;
}

export function countPiecesBetween(board: (Piece | null)[][], from: Position, to: Position): number {
  const rowDiff = Math.abs(to.row - from.row);
  const colDiff = Math.abs(to.col - from.col);
  
  if (rowDiff > 0 && colDiff > 0) return -1;
  
  const rowStep = rowDiff === 0 ? 0 : (to.row - from.row) / rowDiff;
  const colStep = colDiff === 0 ? 0 : (to.col - from.col) / colDiff;
  
  let count = 0;
  let currentRow = from.row + rowStep;
  let currentCol = from.col + colStep;
  
  while (currentRow !== to.row || currentCol !== to.col) {
    if (board[currentRow][currentCol] !== null) {
      count++;
    }
    currentRow += rowStep;
    currentCol += colStep;
  }
  
  return count;
}

export function getValidMoves(board: (Piece | null)[][], piece: Piece, from: Position): Position[] {
  const moves: Position[] = [];
  
  switch (piece.type) {
    case 'king':
      for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        const to = { row: from.row + dr, col: from.col + dc };
        if (isValidPosition(to) && inPalace(to, piece.player)) {
          const targetPiece = board[to.row][to.col];
          if (!targetPiece || targetPiece.player !== piece.player) {
            moves.push(to);
          }
        }
      }
      break;
      
    case 'advisor':
      for (const [dr, dc] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) {
        const to = { row: from.row + dr, col: from.col + dc };
        if (isValidPosition(to) && inPalace(to, piece.player)) {
          const targetPiece = board[to.row][to.col];
          if (!targetPiece || targetPiece.player !== piece.player) {
            moves.push(to);
          }
        }
      }
      break;
      
    case 'elephant':
      for (const [dr, dc] of [[-2, -2], [-2, 2], [2, -2], [2, 2]]) {
        const to = { row: from.row + dr, col: from.col + dc };
        const blocking = { row: from.row + dr/2, col: from.col + dc/2 };
        if (isValidPosition(to) && onSameSide(to, piece.player) && !board[blocking.row][blocking.col]) {
          const targetPiece = board[to.row][to.col];
          if (!targetPiece || targetPiece.player !== piece.player) {
            moves.push(to);
          }
        }
      }
      break;
      
    case 'horse':
      const horsePattern = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
      ];
      const blockingPattern = [
        [-1, 0], [-1, 0], [0, -1], [0, 1],
        [0, -1], [0, 1], [1, 0], [1, 0]
      ];
      
      for (let i = 0; i < horsePattern.length; i++) {
        const [dr, dc] = horsePattern[i];
        const [br, bc] = blockingPattern[i];
        const to = { row: from.row + dr, col: from.col + dc };
        const blocking = { row: from.row + br, col: from.col + bc };
        
        if (isValidPosition(to) && !board[blocking.row][blocking.col]) {
          const targetPiece = board[to.row][to.col];
          if (!targetPiece || targetPiece.player !== piece.player) {
            moves.push(to);
          }
        }
      }
      break;
      
    case 'chariot':
      for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        let currentRow = from.row + dr;
        let currentCol = from.col + dc;
        
        while (isValidPosition({ row: currentRow, col: currentCol })) {
          const targetPiece = board[currentRow][currentCol];
          if (!targetPiece) {
            moves.push({ row: currentRow, col: currentCol });
          } else {
            if (targetPiece.player !== piece.player) {
              moves.push({ row: currentRow, col: currentCol });
            }
            break;
          }
          currentRow += dr;
          currentCol += dc;
        }
      }
      break;
      
    case 'cannon':
      for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        let currentRow = from.row + dr;
        let currentCol = from.col + dc;
        let jumpedOver = false;
        
        while (isValidPosition({ row: currentRow, col: currentCol })) {
          const targetPiece = board[currentRow][currentCol];
          
          if (!jumpedOver) {
            if (!targetPiece) {
              moves.push({ row: currentRow, col: currentCol });
            } else {
              jumpedOver = true;
            }
          } else {
            if (targetPiece && targetPiece.player !== piece.player) {
              moves.push({ row: currentRow, col: currentCol });
              break;
            } else if (targetPiece) {
              break;
            }
          }
          
          currentRow += dr;
          currentCol += dc;
        }
      }
      break;
      
    case 'soldier':
      const forward = piece.player === 'red' ? -1 : 1;
      const crossedRiver = piece.player === 'red' ? from.row <= 4 : from.row >= 5;
      
      const forwardPos = { row: from.row + forward, col: from.col };
      if (isValidPosition(forwardPos)) {
        const targetPiece = board[forwardPos.row][forwardPos.col];
        if (!targetPiece || targetPiece.player !== piece.player) {
          moves.push(forwardPos);
        }
      }
      
      if (crossedRiver) {
        for (const dc of [-1, 1]) {
          const sidePos = { row: from.row, col: from.col + dc };
          if (isValidPosition(sidePos)) {
            const targetPiece = board[sidePos.row][sidePos.col];
            if (!targetPiece || targetPiece.player !== piece.player) {
              moves.push(sidePos);
            }
          }
        }
      }
      break;
  }
  
  return moves;
}

export function isInCheck(board: (Piece | null)[][], player: Player): boolean {
  let kingPos: Position | null = null;
  
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 9; col++) {
      const piece = board[row][col];
      if (piece && piece.type === 'king' && piece.player === player) {
        kingPos = { row, col };
        break;
      }
    }
    if (kingPos) break;
  }
  
  if (!kingPos) return false;
  
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 9; col++) {
      const piece = board[row][col];
      if (piece && piece.player !== player) {
        const moves = getValidMoves(board, piece, { row, col });
        if (moves.some(move => move.row === kingPos!.row && move.col === kingPos!.col)) {
          return true;
        }
      }
    }
  }
  
  return false;
}

export function makeMove(board: (Piece | null)[][], from: Position, to: Position): (Piece | null)[][] {
  const newBoard = board.map(row => [...row]);
  const piece = newBoard[from.row][from.col];
  newBoard[to.row][to.col] = piece;
  newBoard[from.row][from.col] = null;
  return newBoard;
}

export function isCheckmate(board: (Piece | null)[][], player: Player): boolean {
  if (!isInCheck(board, player)) return false;
  
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 9; col++) {
      const piece = board[row][col];
      if (piece && piece.player === player) {
        const moves = getValidMoves(board, piece, { row, col });
        for (const move of moves) {
          const testBoard = makeMove(board, { row, col }, move);
          if (!isInCheck(testBoard, player)) {
            return false;
          }
        }
      }
    }
  }
  
  return true;
}