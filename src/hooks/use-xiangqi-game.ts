import { useState, useCallback } from 'react';
import { useKV } from '@github/spark/hooks';
import { GameState, Position, Move, initialBoard, Player } from '@/lib/xiangqi-types';
import { getValidMoves, makeMove, isInCheck, isCheckmate } from '@/lib/xiangqi-rules';
import { getBestMove } from '@/lib/xiangqi-ai';

export function useXiangqiGame() {
  const [gameState, setGameState] = useKV<GameState>('xiangqi-game', {
    board: initialBoard,
    currentPlayer: 'red',
    selectedPosition: null,
    validMoves: [],
    moveHistory: [],
    gameOver: false,
    winner: null,
    inCheck: false
  });

  const [isAiThinking, setIsAiThinking] = useState(false);

  const selectPosition = useCallback((position: Position) => {
    if (gameState.gameOver || gameState.currentPlayer === 'black') return;

    setGameState((current) => {
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
  }, [gameState.gameOver, gameState.currentPlayer, setGameState]);

  const makeAiMove = useCallback(async () => {
    if (gameState.currentPlayer !== 'black' || gameState.gameOver || isAiThinking) return;
    
    setIsAiThinking(true);
    
    setTimeout(() => {
      setGameState((current) => {
        if (current.currentPlayer !== 'black' || current.gameOver) {
          return current;
        }

        const aiMove = getBestMove(current.board, 'black', 3);
        
        if (aiMove) {
          const newBoard = makeMove(current.board, aiMove.from, aiMove.to);
          
          const newState = {
            board: newBoard,
            currentPlayer: 'red' as Player,
            selectedPosition: null,
            validMoves: [],
            moveHistory: [...current.moveHistory, aiMove],
            gameOver: isCheckmate(newBoard, 'red'),
            winner: isCheckmate(newBoard, 'red') ? 'black' as Player : null,
            inCheck: isInCheck(newBoard, 'red')
          };
          
          return newState;
        }
        
        return current;
      });
      
      // Set AI thinking to false after the state update
      setIsAiThinking(false);
    }, 500);
  }, [gameState.currentPlayer, gameState.gameOver, isAiThinking, setGameState]);

  const resetGame = useCallback(() => {
    setGameState({
      board: initialBoard,
      currentPlayer: 'red',
      selectedPosition: null,
      validMoves: [],
      moveHistory: [],
      gameOver: false,
      winner: null,
      inCheck: false
    });
  }, [setGameState]);

  return {
    gameState,
    selectPosition,
    makeAiMove,
    resetGame,
    isAiThinking
  };
}