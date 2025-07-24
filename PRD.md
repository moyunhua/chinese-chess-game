# Chinese Chess (Xiangqi) Game

Create an elegant Chinese Chess game with human vs AI gameplay featuring traditional aesthetics and intuitive controls.

**Experience Qualities**:
1. **Elegant** - Classical Chinese aesthetics with traditional board and pieces
2. **Intuitive** - Clear visual feedback and easy-to-understand gameplay mechanics
3. **Engaging** - Challenging AI opponent with multiple difficulty levels

**Complexity Level**: Light Application (multiple features with basic state)
- Combines game logic, AI opponent, and visual interface with persistent game state

## Essential Features

**Game Board Display**
- Functionality: Renders traditional 9x10 Xiangqi board with river and palace markings
- Purpose: Provides authentic playing experience
- Trigger: App initialization
- Progression: Load board → Display pieces → Ready for moves
- Success criteria: Board displays correctly with proper proportions and traditional styling

**Piece Movement**
- Functionality: Click-to-select and click-to-move piece interaction
- Purpose: Core gameplay mechanism
- Trigger: Player clicks on their piece
- Progression: Select piece → Highlight valid moves → Click destination → Execute move → Check game state
- Success criteria: All pieces move according to Xiangqi rules with visual feedback

**AI Opponent**
- Functionality: Computer player with configurable difficulty
- Purpose: Single-player gameplay experience
- Trigger: Player completes their move
- Progression: Analyze position → Calculate best move → Execute move → Update board
- Success criteria: AI makes legal, strategic moves within reasonable time

**Game State Management**
- Functionality: Track game progress, captures, and win conditions
- Purpose: Maintain game integrity and determine outcomes
- Trigger: After each move
- Progression: Validate move → Update position → Check for checkmate/stalemate → Continue or end game
- Success criteria: Accurate rule enforcement and proper game ending detection

**Move History**
- Functionality: Display chronological list of moves in Chinese notation
- Purpose: Allow players to review and understand the game progression
- Trigger: After each completed move
- Progression: Record move → Update history display → Allow scrolling through moves
- Success criteria: Complete, accurate move notation that updates in real-time

## Edge Case Handling

- **Invalid Moves**: Highlight illegal moves in red with brief animation feedback
- **AI Thinking Time**: Show subtle loading indicator during computer calculation
- **Game Ending**: Clear modal dialog announcing winner with option to restart
- **Piece Selection**: Deselect piece when clicking empty square or opponent piece

## Design Direction

The design should evoke traditional Chinese elegance with a modern, clean interface that feels both classical and approachable, emphasizing the cultural heritage of Xiangqi while remaining accessible to contemporary users.

## Color Selection

Triadic color scheme using warm earth tones that reflect traditional Chinese aesthetics with red, gold, and deep brown creating harmony and cultural authenticity.

- **Primary Color**: Deep Crimson `oklch(0.45 0.15 20)` - Represents traditional Chinese red, used for player pieces and primary actions
- **Secondary Colors**: Warm Gold `oklch(0.75 0.12 85)` for highlights and Imperial Brown `oklch(0.25 0.05 45)` for board elements
- **Accent Color**: Bright Gold `oklch(0.85 0.15 90)` - Attention-grabbing highlight for selected pieces and valid moves
- **Foreground/Background Pairings**: 
  - Background (Cream `oklch(0.95 0.02 80)`): Dark Brown text `oklch(0.2 0.05 45)` - Ratio 8.2:1 ✓
  - Card (Light Bamboo `oklch(0.92 0.03 85)`): Dark Brown text `oklch(0.2 0.05 45)` - Ratio 7.8:1 ✓
  - Primary (Deep Crimson): White text `oklch(0.98 0 0)` - Ratio 6.2:1 ✓
  - Accent (Bright Gold): Dark Brown text `oklch(0.2 0.05 45)` - Ratio 9.1:1 ✓

## Font Selection

Typography should convey traditional elegance while maintaining excellent readability, using a clean sans-serif for UI elements and potentially incorporating Chinese characters where appropriate.

- **Typographic Hierarchy**: 
  - H1 (Game Title): Inter Bold/32px/tight letter spacing
  - H2 (Section Headers): Inter SemiBold/24px/normal spacing  
  - Body (Move History): Inter Regular/16px/relaxed line height
  - Labels (Piece Names): Inter Medium/14px/normal spacing

## Animations

Subtle, purposeful animations that enhance the traditional game experience without overwhelming the classical aesthetic, focusing on smooth piece movements and gentle feedback.

- **Purposeful Meaning**: Piece movements should feel weighty and deliberate, reflecting the strategic nature of the game
- **Hierarchy of Movement**: Selected pieces get gentle highlighting, valid moves show subtle pulsing, captures have brief celebratory animation

## Component Selection

- **Components**: Card for game board container, Button for game controls, Badge for captured pieces, ScrollArea for move history, Dialog for game end notifications
- **Customizations**: Custom board grid component, piece components with traditional symbols, move indicator overlays
- **States**: Pieces have normal/selected/valid-target states with distinct visual treatment, buttons show hover/active/disabled states
- **Icon Selection**: Traditional Chinese chess piece symbols, navigation arrows for move history, settings gear for options
- **Spacing**: Consistent 16px base spacing with tighter 8px for piece positioning and 24px for major sections
- **Mobile**: Board scales responsively, move history becomes collapsible drawer, touch-friendly piece selection with larger hit areas