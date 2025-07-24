import { Move, PIECE_SYMBOLS } from '@/lib/xiangqi-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MoveHistoryProps {
  moves: Move[];
}

export function MoveHistory({ moves }: MoveHistoryProps) {
  const formatPosition = (row: number, col: number) => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
    return `${files[col]}${10 - row}`;
  };

  const formatMove = (move: Move, index: number) => {
    const moveNumber = Math.floor(index / 2) + 1;
    const isRedMove = index % 2 === 0;
    const piece = PIECE_SYMBOLS[move.piece.type][move.piece.player];
    const from = formatPosition(move.from.row, move.from.col);
    const to = formatPosition(move.to.row, move.to.col);
    const capture = move.captured ? 'x' : '-';
    
    return {
      moveNumber: isRedMove ? moveNumber : null,
      text: `${piece}${from}${capture}${to}`,
      isRedMove
    };
  };

  return (
    <Card className="w-80 h-96">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">着法记录</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-1">
            {moves.length === 0 ? (
              <p className="text-muted-foreground text-sm">暂无着法</p>
            ) : (
              <div className="grid grid-cols-3 gap-2 text-sm">
                {moves.map((move, index) => {
                  const formatted = formatMove(move, index);
                  return (
                    <div key={index} className="contents">
                      {formatted.moveNumber && (
                        <div className="text-muted-foreground font-medium">
                          {formatted.moveNumber}.
                        </div>
                      )}
                      <div 
                        className={`font-mono ${
                          formatted.isRedMove ? 'text-red-600' : 'text-gray-800'
                        }`}
                      >
                        {formatted.text}
                      </div>
                      {!formatted.isRedMove && <div></div>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}