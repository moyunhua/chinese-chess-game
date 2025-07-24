import { GameState } from '@/lib/xiangqi-types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RotateCcw, Crown, AlertTriangle } from '@phosphor-icons/react';

interface GameStatusProps {
  gameState: GameState;
  isAiThinking: boolean;
  onReset: () => void;
}

export function GameStatus({ gameState, isAiThinking, onReset }: GameStatusProps) {
  const getCurrentPlayerText = () => {
    if (gameState.gameOver) {
      return gameState.winner === 'red' ? '红方胜利!' : '黑方胜利!';
    }
    if (isAiThinking) {
      return '电脑思考中...';
    }
    return gameState.currentPlayer === 'red' ? '红方行棋' : '黑方行棋';
  };

  const getStatusColor = () => {
    if (gameState.gameOver) return 'destructive';
    if (gameState.inCheck) return 'destructive';
    if (isAiThinking) return 'secondary';
    return gameState.currentPlayer === 'red' ? 'default' : 'secondary';
  };

  return (
    <Card className="w-80">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant={getStatusColor()} className="text-sm px-3 py-1">
              {gameState.gameOver && <Crown className="w-4 h-4 mr-1" />}
              {gameState.inCheck && !gameState.gameOver && <AlertTriangle className="w-4 h-4 mr-1" />}
              {getCurrentPlayerText()}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              重新开始
            </Button>
          </div>
          
          {gameState.inCheck && !gameState.gameOver && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
              <p className="text-destructive text-sm font-medium">
                {gameState.currentPlayer === 'red' ? '红方' : '黑方'}被将军!
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">总回合数</p>
              <p className="font-semibold">{Math.ceil(gameState.moveHistory.length / 2)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">总着法数</p>
              <p className="font-semibold">{gameState.moveHistory.length}</p>
            </div>
          </div>
          
          {isAiThinking && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
              AI正在分析最佳着法...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}