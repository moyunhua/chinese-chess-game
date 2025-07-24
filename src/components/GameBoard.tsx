import { memo } from 'react';
import { GameState, Position } from '@/lib/xiangqi-types';
import { GamePiece } from './GamePiece';
import { Card } from '@/components/ui/card';

interface GameBoardProps {
  gameState: GameState;
  onPositionSelect: (position: Position) => void;
}

export const GameBoard = memo(({ gameState, onPositionSelect }: GameBoardProps) => {
  const isValidMove = (position: Position) => {
    return gameState.validMoves.some(
      move => move.row === position.row && move.col === position.col
    );
  };

  const isSelected = (position: Position) => {
    return gameState.selectedPosition?.row === position.row && 
           gameState.selectedPosition?.col === position.col;
  };

  return (
    <Card className="relative bg-gradient-to-b from-amber-50 to-amber-100 border-2 border-amber-600 shadow-xl">
      <div 
        className="relative bg-amber-100" 
        style={{ width: '560px', height: '610px' }}
      >
        <svg 
          className="absolute inset-0 w-full h-full" 
          viewBox="0 0 560 610"
          style={{ zIndex: 1 }}
        >
          {/* Vertical lines */}
          {Array.from({ length: 9 }, (_, i) => (
            <line
              key={`v-${i}`}
              x1={30 + i * 60}
              y1={30}
              x2={30 + i * 60}
              y2={580}
              stroke="#8B4513"
              strokeWidth="2"
            />
          ))}
          
          {/* Horizontal lines */}
          {Array.from({ length: 10 }, (_, i) => (
            <line
              key={`h-${i}`}
              x1={30}
              y1={30 + i * 55}
              x2={510}
              y2={30 + i * 55}
              stroke="#8B4513"
              strokeWidth="2"
            />
          ))}
          
          {/* River gap */}
          <rect
            x={30}
            y={302.5}
            width={480}
            height={55}
            fill="rgba(135, 206, 235, 0.2)"
            stroke="#4682B4"
            strokeWidth="1"
          />
          
          {/* Palace diagonals - Red */}
          <line x1={210} y1={412.5} x2={270} y2={467.5} stroke="#8B4513" strokeWidth="2" />
          <line x1={270} y1={412.5} x2={210} y2={467.5} stroke="#8B4513" strokeWidth="2" />
          <line x1={270} y1={467.5} x2={330} y2={522.5} stroke="#8B4513" strokeWidth="2" />
          <line x1={330} y1={467.5} x2={270} y2={522.5} stroke="#8B4513" strokeWidth="2" />
          
          {/* Palace diagonals - Black */}
          <line x1={210} y1={85} x2={270} y2={140} stroke="#8B4513" strokeWidth="2" />
          <line x1={270} y1={85} x2={210} y2={140} stroke="#8B4513" strokeWidth="2" />
          <line x1={270} y1={30} x2={330} y2={85} stroke="#8B4513" strokeWidth="2" />
          <line x1={330} y1={30} x2={270} y2={85} stroke="#8B4513" strokeWidth="2" />
          
          {/* River text */}
          <text x={280} y={325} textAnchor="middle" className="fill-blue-700 text-lg font-bold">
            楚河
          </text>
          <text x={280} y={345} textAnchor="middle" className="fill-blue-700 text-lg font-bold">
            漢界
          </text>
        </svg>
        
        {/* Game pieces */}
        {gameState.board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const position = { row: rowIndex, col: colIndex };
            return (
              <GamePiece
                key={`${rowIndex}-${colIndex}`}
                piece={piece}
                position={position}
                isSelected={isSelected(position)}
                isValidMove={isValidMove(position)}
                onSelect={onPositionSelect}
              />
            );
          })
        )}
        
        {/* Valid move indicators for empty squares */}
        {gameState.validMoves.map((move, index) => {
          const piece = gameState.board[move.row][move.col];
          if (piece) return null; // Don't show indicator if there's already a piece
          
          return (
            <div
              key={`move-${index}`}
              className="absolute w-4 h-4 bg-accent rounded-full border-2 border-accent-foreground cursor-pointer hover:scale-125 transition-transform"
              style={{
                left: `${move.col * 60 + 36}px`,
                top: `${move.row * 55 + 36}px`,
                zIndex: 8
              }}
              onClick={() => onPositionSelect(move)}
            />
          );
        })}
      </div>
    </Card>
  );
});

GameBoard.displayName = 'GameBoard';