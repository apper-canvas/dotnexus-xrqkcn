import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

const MainFeature = () => {
  // Grid configuration
  const [gridSize, setGridSize] = useState(5);
  const [gameBoard, setGameBoard] = useState({
    horizontalLines: [],
    verticalLines: [],
    boxes: []
  });
  const [currentPlayer, setCurrentPlayer] = useState(1); // 1 or 2
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  
  // Icons
  const SettingsIcon = getIcon('Settings');
  const RefreshCwIcon = getIcon('RefreshCw');
  const TrophyIcon = getIcon('Trophy');
  const UserIcon = getIcon('User');
  const UsersIcon = getIcon('Users');
  const GridIcon = getIcon('Grid');
  const XIcon = getIcon('X');
  const CheckIcon = getIcon('Check');
  
  const playerColors = {
    1: 'text-primary',
    2: 'text-secondary'
  };
  
  const playerBgColors = {
    1: 'bg-primary',
    2: 'bg-secondary'
  };
  
  // Initialize game board
  useEffect(() => {
    initializeGame();
  }, [gridSize]);
  
  const initializeGame = () => {
    // Initialize empty arrays for lines
    const horizontalLines = Array(gridSize).fill().map(() => Array(gridSize + 1).fill(0));
    const verticalLines = Array(gridSize + 1).fill().map(() => Array(gridSize).fill(0));
    const boxes = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
    
    setGameBoard({
      horizontalLines,
      verticalLines,
      boxes
    });
    
    setScores({ player1: 0, player2: 0 });
    setCurrentPlayer(1);
    setGameOver(false);
  };
  
  const handleLineClick = (lineType, row, col) => {
    if (gameOver) return;
    
    // Copy the current game board
    const newGameBoard = {
      horizontalLines: [...gameBoard.horizontalLines.map(row => [...row])],
      verticalLines: [...gameBoard.verticalLines.map(row => [...row])],
      boxes: [...gameBoard.boxes.map(row => [...row])]
    };
    
    // If the line is already drawn, do nothing
    if (lineType === 'horizontal' && newGameBoard.horizontalLines[row][col] !== 0) return;
    if (lineType === 'vertical' && newGameBoard.verticalLines[row][col] !== 0) return;
    
    // Draw the line with current player's number
    if (lineType === 'horizontal') {
      newGameBoard.horizontalLines[row][col] = currentPlayer;
    } else {
      newGameBoard.verticalLines[row][col] = currentPlayer;
    }
    
    // Check if any boxes were completed
    let boxCompleted = false;
    
    if (lineType === 'horizontal') {
      // Check the box above (if not on top row)
      if (row > 0) {
        const boxRow = row - 1;
        const boxCol = col;
        
        if (
          newGameBoard.horizontalLines[boxRow][boxCol] !== 0 && // Top
          newGameBoard.verticalLines[boxRow][boxCol] !== 0 && // Left
          newGameBoard.verticalLines[boxRow][boxCol + 1] !== 0 // Right
        ) {
          newGameBoard.boxes[boxRow][boxCol] = currentPlayer;
          boxCompleted = true;
          
          // Update scores
          if (currentPlayer === 1) {
            setScores(prev => ({ ...prev, player1: prev.player1 + 1 }));
          } else {
            setScores(prev => ({ ...prev, player2: prev.player2 + 1 }));
          }
        }
      }
      
      // Check the box below (if not on bottom row)
      if (row < gridSize - 1) {
        const boxRow = row;
        const boxCol = col;
        
        if (
          newGameBoard.horizontalLines[boxRow + 1][boxCol] !== 0 && // Bottom
          newGameBoard.verticalLines[boxRow][boxCol] !== 0 && // Left
          newGameBoard.verticalLines[boxRow][boxCol + 1] !== 0 // Right
        ) {
          newGameBoard.boxes[boxRow][boxCol] = currentPlayer;
          boxCompleted = true;
          
          // Update scores
          if (currentPlayer === 1) {
            setScores(prev => ({ ...prev, player1: prev.player1 + 1 }));
          } else {
            setScores(prev => ({ ...prev, player2: prev.player2 + 1 }));
          }
        }
      }
    } else if (lineType === 'vertical') {
      // Check the box to the left (if not on leftmost column)
      if (col > 0) {
        const boxRow = row;
        const boxCol = col - 1;
        
        if (
          newGameBoard.horizontalLines[boxRow][boxCol] !== 0 && // Top
          newGameBoard.horizontalLines[boxRow + 1][boxCol] !== 0 && // Bottom
          newGameBoard.verticalLines[boxRow][boxCol] !== 0 // Left
        ) {
          newGameBoard.boxes[boxRow][boxCol] = currentPlayer;
          boxCompleted = true;
          
          // Update scores
          if (currentPlayer === 1) {
            setScores(prev => ({ ...prev, player1: prev.player1 + 1 }));
          } else {
            setScores(prev => ({ ...prev, player2: prev.player2 + 1 }));
          }
        }
      }
      
      // Check the box to the right (if not on rightmost column)
      if (col < gridSize - 1) {
        const boxRow = row;
        const boxCol = col;
        
        if (
          newGameBoard.horizontalLines[boxRow][boxCol] !== 0 && // Top
          newGameBoard.horizontalLines[boxRow + 1][boxCol] !== 0 && // Bottom
          newGameBoard.verticalLines[boxRow][boxCol + 1] !== 0 // Right
        ) {
          newGameBoard.boxes[boxRow][boxCol] = currentPlayer;
          boxCompleted = true;
          
          // Update scores
          if (currentPlayer === 1) {
            setScores(prev => ({ ...prev, player1: prev.player1 + 1 }));
          } else {
            setScores(prev => ({ ...prev, player2: prev.player2 + 1 }));
          }
        }
      }
    }
    
    // Update the game board
    setGameBoard(newGameBoard);
    
    // Check if the game is over
    const totalBoxes = gridSize * gridSize;
    const filledBoxes = scores.player1 + scores.player2 + (boxCompleted ? 1 : 0);
    
    if (filledBoxes === totalBoxes) {
      setGameOver(true);
      
      setTimeout(() => {
        if (scores.player1 > scores.player2) {
          toast.success("Player 1 wins!");
        } else if (scores.player2 > scores.player1) {
          toast.success("Player 2 wins!");
        } else {
          toast.info("It's a tie!");
        }
      }, 500);
    }
    
    // Switch to the next player if no box was completed
    if (!boxCompleted) {
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    } else {
      toast.info("Box completed! You get another turn!");
    }
  };
  
  const resetGame = () => {
    initializeGame();
    toast.info("Game reset!");
  };
  
  const saveGridSize = (size) => {
    if (size < 3) size = 3;
    if (size > 10) size = 10;
    
    setGridSize(size);
    setCustomizing(false);
    toast.success(`Grid size set to ${size}x${size}`);
  };
  
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gradient mb-4 md:mb-0">
          DotNexus
        </h1>
        
        <div className="flex gap-3">
          <motion.button
            className="btn btn-outline flex items-center gap-2"
            onClick={() => setCustomizing(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={customizing}
          >
            <SettingsIcon size={18} />
            <span className="hidden sm:inline">Settings</span>
          </motion.button>
          
          <motion.button
            className="btn btn-primary flex items-center gap-2"
            onClick={resetGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={customizing}
          >
            <RefreshCwIcon size={18} />
            <span className="hidden sm:inline">New Game</span>
          </motion.button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 xl:col-span-3 order-2 lg:order-1">
          <div className="card-neu p-6 mb-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <UsersIcon size={20} />
              <span>Players</span>
            </h2>
            
            <div className="space-y-6">
              <div className={`p-4 rounded-xl transition-all duration-300 ${currentPlayer === 1 ? 'bg-primary/10 dark:bg-primary/20 ring-2 ring-primary' : 'bg-surface-200/50 dark:bg-surface-700/50'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-full ${playerBgColors[1]} flex items-center justify-center text-white`}>
                    <UserIcon size={16} />
                  </div>
                  <h3 className="font-semibold text-lg">Player 1</h3>
                  {currentPlayer === 1 && !gameOver && 
                    <span className="ml-auto text-xs font-medium bg-primary/20 text-primary px-2 py-1 rounded-full">
                      Current Turn
                    </span>
                  }
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-primary">{scores.player1}</div>
                  <div className="text-sm text-surface-500">boxes</div>
                  
                  {gameOver && scores.player1 > scores.player2 && (
                    <div className="ml-auto flex items-center gap-1 text-primary font-medium">
                      <TrophyIcon size={16} />
                      <span>Winner!</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className={`p-4 rounded-xl transition-all duration-300 ${currentPlayer === 2 ? 'bg-secondary/10 dark:bg-secondary/20 ring-2 ring-secondary' : 'bg-surface-200/50 dark:bg-surface-700/50'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-full ${playerBgColors[2]} flex items-center justify-center text-white`}>
                    <UserIcon size={16} />
                  </div>
                  <h3 className="font-semibold text-lg">Player 2</h3>
                  {currentPlayer === 2 && !gameOver && 
                    <span className="ml-auto text-xs font-medium bg-secondary/20 text-secondary px-2 py-1 rounded-full">
                      Current Turn
                    </span>
                  }
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-secondary">{scores.player2}</div>
                  <div className="text-sm text-surface-500">boxes</div>
                  
                  {gameOver && scores.player2 > scores.player1 && (
                    <div className="ml-auto flex items-center gap-1 text-secondary font-medium">
                      <TrophyIcon size={16} />
                      <span>Winner!</span>
                    </div>
                  )}
                </div>
              </div>
              
              {gameOver && scores.player1 === scores.player2 && (
                <div className="p-4 bg-accent/10 dark:bg-accent/20 rounded-xl text-center">
                  <p className="font-medium text-accent">It's a tie!</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="card-neu p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <GridIcon size={20} />
              <span>Game Info</span>
            </h2>
            
            <div className="space-y-3 text-surface-600 dark:text-surface-400">
              <div className="flex justify-between">
                <span>Grid Size:</span>
                <span className="font-medium">{gridSize}×{gridSize}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Total Boxes:</span>
                <span className="font-medium">{gridSize * gridSize}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Boxes Claimed:</span>
                <span className="font-medium">{scores.player1 + scores.player2}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Boxes Remaining:</span>
                <span className="font-medium">{gridSize * gridSize - (scores.player1 + scores.player2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-8 xl:col-span-9 order-1 lg:order-2">
          <motion.div 
            className="card-neu flex items-center justify-center py-8 px-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div 
              className="relative"
              style={{
                width: `${Math.min(gridSize * 60, 600)}px`,
                height: `${Math.min(gridSize * 60, 600)}px`,
              }}
            >
              {/* Render boxes */}
              {gameBoard.boxes.map((row, rowIndex) => (
                row.map((box, colIndex) => (
                  box !== 0 && (
                    <motion.div
                      key={`box-${rowIndex}-${colIndex}`}
                      className={`absolute rounded-sm ${playerBgColors[box]}/20`}
                      style={{
                        top: rowIndex * 60 + 10,
                        left: colIndex * 60 + 10,
                        width: 50,
                        height: 50,
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center justify-center h-full">
                        <span className={`font-bold ${playerColors[box]}`}>{box}</span>
                      </div>
                    </motion.div>
                  )
                ))
              ))}
              
              {/* Render dots */}
              {Array(gridSize + 1).fill().map((_, rowIndex) => (
                Array(gridSize + 1).fill().map((_, colIndex) => (
                  <div
                    key={`dot-${rowIndex}-${colIndex}`}
                    className="absolute w-4 h-4 rounded-full bg-surface-600 dark:bg-surface-400"
                    style={{
                      top: rowIndex * 60,
                      left: colIndex * 60,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                ))
              ))}
              
              {/* Render horizontal lines */}
              {gameBoard.horizontalLines.map((row, rowIndex) => (
                row.map((line, colIndex) => (
                  <div
                    key={`h-line-${rowIndex}-${colIndex}`}
                    className={`absolute cursor-pointer transition-all duration-300 ${
                      line ? playerColors[line] : 'bg-surface-300/50 dark:bg-surface-600/50 hover:bg-surface-400/70 dark:hover:bg-surface-500/70'
                    }`}
                    style={{
                      top: rowIndex * 60,
                      left: colIndex * 60,
                      width: 60,
                      height: line ? 4 : 2,
                      transform: 'translateY(-50%)',
                    }}
                    onClick={() => handleLineClick('horizontal', rowIndex, colIndex)}
                  />
                ))
              ))}
              
              {/* Render vertical lines */}
              {gameBoard.verticalLines.map((row, rowIndex) => (
                row.map((line, colIndex) => (
                  <div
                    key={`v-line-${rowIndex}-${colIndex}`}
                    className={`absolute cursor-pointer transition-all duration-300 ${
                      line ? playerColors[line] : 'bg-surface-300/50 dark:bg-surface-600/50 hover:bg-surface-400/70 dark:hover:bg-surface-500/70'
                    }`}
                    style={{
                      top: rowIndex * 60,
                      left: colIndex * 60,
                      width: line ? 4 : 2,
                      height: 60,
                      transform: 'translateX(-50%)',
                    }}
                    onClick={() => handleLineClick('vertical', rowIndex, colIndex)}
                  />
                ))
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Settings modal */}
      <AnimatePresence>
        {customizing && (
          <motion.div 
            className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCustomizing(false)}
          >
            <motion.div 
              className="bg-white dark:bg-surface-800 rounded-2xl p-6 w-full max-w-md"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Game Settings</h2>
                <button 
                  className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                  onClick={() => setCustomizing(false)}
                >
                  <XIcon size={20} />
                </button>
              </div>
              
              <div className="mb-6">
                <label className="block mb-2 font-medium">Grid Size</label>
                <div className="flex gap-4 items-center">
                  <input
                    type="range"
                    min="3"
                    max="10"
                    className="w-full h-2 bg-surface-200 rounded-lg appearance-none cursor-pointer dark:bg-surface-700"
                    value={gridSize}
                    onChange={(e) => setGridSize(parseInt(e.target.value))}
                  />
                  <span className="bg-surface-100 dark:bg-surface-700 px-3 py-1 rounded-lg min-w-[40px] text-center">
                    {gridSize}
                  </span>
                </div>
                <p className="text-sm text-surface-500 mt-2">
                  {gridSize < 5 ? "Smaller grid for quick games" : 
                   gridSize < 7 ? "Medium grid for balanced gameplay" : 
                   "Larger grid for strategic challenges"}
                </p>
              </div>
              
              <div className="text-center">
                <motion.button
                  className="btn btn-primary inline-flex items-center gap-2 px-6"
                  onClick={() => saveGridSize(gridSize)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <CheckIcon size={18} />
                  <span>Apply Settings</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainFeature;