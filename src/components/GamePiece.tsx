import { memo } from 'react';
import { Piece, Position, PIECE_SYMBOLS } from '@/lib/xiangqi-types';
import { cn } from '@/lib/utils';

interface GamePieceProps {
  piece: Piece | null;
  position: Position;
  isSelected: boolean;
  isValidMove: boolean;
  onSelect: (position: Position) => void;
}

export const GamePiece = memo(({ piece, position, isSelected, isValidMove, onSelect }: GamePieceProps) => {
  return (
    <button
      className={cn(
        "absolute w-12 h-12 rounded-full border-2 transition-all duration-200 flex items-center justify-center text-lg font-bold",
        "hover:scale-105 active:scale-95",
        piece && piece.player === 'red' 
          ? "bg-gradient-to-b from-red-100 to-red-50 border-red-600 text-red-800 shadow-md"
          : piece 
          ? "bg-gradient-to-b from-gray-800 to-gray-900 border-gray-700 text-white shadow-md"
          : "bg-transparent border-transparent",
        isSelected && "ring-4 ring-accent shadow-lg scale-110",
        isValidMove && !piece && "bg-accent/20 border-accent border-dashed",
        isValidMove && piece && "ring-2 ring-destructive"
      )}
      style={{
        left: `${position.col * 60 + 20}px`,
        top: `${position.row * 55 + 20}px`,
        zIndex: isSelected ? 20 : piece ? 10 : 5
      }}
      onClick={() => onSelect(position)}
      disabled={false}
    >
      {piece && PIECE_SYMBOLS[piece.type][piece.player]}
    </button>
  );
});

GamePiece.displayName = 'GamePiece';