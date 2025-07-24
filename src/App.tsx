import { useEffect } from 'react';
import { GameBoard } from '@/components/GameBoard';
import { MoveHistory } from '@/components/MoveHistory';
import { GameStatus } from '@/components/GameStatus';
import { useXiangqiGame } from '@/hooks/use-xiangqi-game';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown } from '@phosphor-icons/react';

function App() {
  const { gameState, selectPosition, makeAiMove, resetGame, isAiThinking } = useXiangqiGame();

  useEffect(() => {
    if (gameState.currentPlayer === 'black' && !gameState.gameOver) {
      makeAiMove();
    }
  }, [gameState.currentPlayer, gameState.gameOver, makeAiMove]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">中国象棋</h1>
          <p className="text-muted-foreground">Chinese Chess - Xiangqi</p>
        </header>
        
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          <div className="flex flex-col gap-4">
            <GameStatus 
              gameState={gameState} 
              isAiThinking={isAiThinking}
              onReset={resetGame}
            />
            <MoveHistory moves={gameState.moveHistory} />
          </div>
          
          <GameBoard 
            gameState={gameState} 
            onPositionSelect={selectPosition} 
          />
        </div>
      </div>

      <Dialog open={gameState.gameOver}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-center justify-center">
              <Crown className="w-6 h-6 text-accent" />
              游戏结束
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <p className="text-xl font-semibold">
              {gameState.winner === 'red' ? '🔴 红方获胜!' : '⚫ 黑方获胜!'}
            </p>
            <p className="text-muted-foreground">
              总共走了 {gameState.moveHistory.length} 步
            </p>
            <Button onClick={resetGame} className="w-full">
              再来一局
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;