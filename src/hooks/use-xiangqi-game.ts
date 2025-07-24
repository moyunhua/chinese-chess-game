import { useState, useCallback, useMemo, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { GameState, Position, Move, initialBoard, Player } from '@/lib/xiangqi-types';
import { getValidMoves, makeMove, isInCheck, isCheckmate } from '@/lib/xiangqi-rules';
import { getBestMove } from '@/lib/xiangqi-ai';

const createInitialGameState = (): GameState => ({
  board: initialBoard,
  currentPlayer: 'red',
  selectedPosition: null,
  validMoves: [],
  moveHistory: [],
  gameOver: false,
  winner: null,
  inCheck: false
});

export function useXiangqiGame() {
  const initialGameState = useMemo(createInitialGameState, []);
  const [gameState, setGameState] = useKV<GameState>('xiangqi-game', initialGameState);
  const [isAiThinking, setIsAiThinking] = useState(false);

  const selectPosition = useCallback((position: Position) => {
    setGameState((current) => {
      if (current.gameOver || current.currentPlayer === 'black') return current;

      const piece = current.board[position.row][position.col];
      
      if (current.selectedPosition) {
        const isValidMove = current.validMoves.some(
          move => move.row === position.row && move.col === position.col
        );
        
        if (isValidMove) {
          const selectedPiece = current.board[current.selectedPosition.row][current.selectedPosition.col]!;
          const newBoard = makeMove(current.board, current.selectedPosition, position);
          
          if (!isInCheck(newBoard, current.currentPlayer)) {
            const move: Move = {
              from: current.selectedPosition,
              to: position,
              piece: selectedPiece,
              captured: current.board[position.row][position.col] || undefined
            };
            
            const newGameState: GameState = {
              board: newBoard,
              currentPlayer: 'black',
              selectedPosition: null,
              validMoves: [],
              moveHistory: [...current.moveHistory, move],
              gameOver: isCheckmate(newBoard, 'black'),
              winner: isCheckmate(newBoard, 'black') ? 'red' : null,
              inCheck: isInCheck(newBoard, 'black')
            };
            
            return newGameState;
          }
        }
        
        return {
          ...current,
          selectedPosition: null,
          validMoves: []
        };
      } else if (piece && piece.player === current.currentPlayer) {
        const validMoves = getValidMoves(current.board, piece, position);
        return {
          ...current,
          selectedPosition: position,
          validMoves
        };
      }
      
      return current;
    });
  }, [setGameState]);

  const makeAiMove = useCallback(() => {
    setGameState((current) => {
      if (current.currentPlayer !== 'black' || current.gameOver || isAiThinking) {
        return current;
      }

      setIsAiThinking(true);

      // Use setTimeout to avoid blocking the UI
      setTimeout(() => {
        setGameState((latestState) => {
          if (latestState.currentPlayer !== 'black' || latestState.gameOver) {
            setIsAiThinking(false);
            return latestState;
          }

          const aiMove = getBestMove(latestState.board, 'black', 3);
          
          if (aiMove) {
            const newBoard = makeMove(latestState.board, aiMove.from, aiMove.to);
            
            const newState = {
              board: newBoard,
              currentPlayer: 'red' as Player,
              selectedPosition: null,
              validMoves: [],
              moveHistory: [...latestState.moveHistory, aiMove],
              gameOver: isCheckmate(newBoard, 'red'),
              winner: isCheckmate(newBoard, 'red') ? 'black' as Player : null,
              inCheck: isInCheck(newBoard, 'red')
            };
            
            setIsAiThinking(false);
            return newState;
          }
          
          setIsAiThinking(false);
          return latestState;
        });
      }, 500);

      return current;
    });
  }, [setGameState, isAiThinking]);

  const resetGame = useCallback(() => {
    setIsAiThinking(false);
    setGameState(createInitialGameState());
  }, [setGameState]);

  return {
    gameState,
    selectPosition,
    makeAiMove,
    resetGame,
    isAiThinking
  };
}