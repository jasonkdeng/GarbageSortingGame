import React, { useState, useEffect } from 'react';

const GarbageSortingGame = () => {
  // Game items with their correct bins
  const items = [
    { name: 'Banana Peel', bin: 'green', image: '🍌' },
    { name: 'Plastic Bottle', bin: 'blue', image: '🍶' },
    { name: 'Paper', bin: 'blue', image: '📄' },
    { name: 'Shredded Paper', bin: 'green', image: '📄' },
    { name: 'Coffee Grounds', bin: 'green', image: '☕' },
    { name: 'Glass Jar', bin: 'blue', image: '🫙' },
    { name: 'Styrofoam Container', bin: 'garbage', image: '🍱' },
    { name: 'Apple Core', bin: 'green', image: '🍎' },
    { name: 'Cardboard Box', bin: 'blue', image: '📦' },
    { name: 'Candy Wrapper', bin: 'garbage', image: '🍬' },
    { name: 'Egg Shells', bin: 'green', image: '🥚' },
    { name: 'Plastic Bag', bin: 'garbage', image: '🛍️' },
    { name: 'Pizza Box (greasy)', bin: 'garbage', image: '🍕' },
    { name: 'Metal Can', bin: 'blue', image: '🥫' },
    { name: 'Tea Bag', bin: 'green', image: '🍵' },
    { name: 'Broken </3 Glass', bin: 'garbage', image: '💔' }
  ];

  const [currentItem, setCurrentItem] = useState(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackColor, setFeedbackColor] = useState('black');
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(75);
  const [highScore, setHighScore] = useState(0);

  // Initialize or load game
  useEffect(() => {
    if (gameStarted && !gameOver) {
      // Select a random item at the start
      selectRandomItem();
      
      // Set up timer
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            endGame();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [gameStarted, gameOver]);

  // Select a random item
  const selectRandomItem = () => {
    const randomIndex = Math.floor(Math.random() * items.length);
    setCurrentItem(items[randomIndex]);
  };

  // Handle bin selection
  const handleBinSelection = (selectedBin) => {
    if (currentItem && !gameOver) {
      if (selectedBin === currentItem.bin) {
        // Correct
        setScore(score + 10);
        setFeedback('Correct! +10 points');
        setFeedbackColor('green');
      } else {
        // Incorrect
        setFeedback(`Incorrect! That goes in the ${currentItem.bin} bin`);
        setFeedbackColor('red');
      }
      
      setRound(round + 1);
      
      // Clear feedback after a short delay
      setTimeout(() => {
        setFeedback('');
        selectRandomItem();
      }, 1000);
    }
  };

  // Start game
  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setRound(0);
    setGameOver(false);
    setTimeLeft(60);
    setFeedback('');
  };

  // End game
  const endGame = () => {
    setGameOver(true);
    if (score > highScore) {
      setHighScore(score);
    }
    setFeedback(`Game Over! Your score: ${score}`);
    setFeedbackColor('blue');
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg shadow-lg min-h-full">
      {!gameStarted ? (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Garbage Sorting Game</h1>
          <p className="mb-4">Sort the garbage items into the correct bins:</p>
          <ul className="mb-6 text-left">
            <li className="mb-2"><span className="font-bold text-green-600">Green Bin:</span> Compostable items (food scraps, plant matter)</li>
            <li className="mb-2"><span className="font-bold text-blue-600">Blue Box:</span> Recyclable items (paper, plastic, metal, glass)</li>
            <li className="mb-2"><span className="font-bold text-gray-600">Garbage:</span> Non-recyclable, non-compostable waste</li>
          </ul>
          <p className="mb-6">You have 60 seconds. Each correct answer gives you 10 points!</p>
          <button 
            onClick={startGame} 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Start Game
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full max-w-lg">
          <div className="flex justify-between w-full mb-4">
            <div className="text-lg font-bold">Score: {score}</div>
            <div className="text-lg font-bold">Time: {timeLeft}s</div>
          </div>
          
          {gameOver ? (
            <div className="text-center">
              <p className="text-xl mb-4">Game Over!</p>
              <p className="text-2xl font-bold mb-4">Your Score: {score}</p>
              <p className="mb-4">High Score: {highScore}</p>
              <button 
                onClick={startGame} 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Play Again
              </button>
            </div>
          ) : (
            <>
              {currentItem && (
                <div className="text-center mb-8">
                  <div className="text-6xl mb-2">{currentItem.image}</div>
                  <p className="text-xl font-bold">{currentItem.name}</p>
                </div>
              )}
              
              <div className="flex justify-between w-full space-x-2 mb-6">
                <button
                  onClick={() => handleBinSelection('green')}
                  className="flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-2 rounded flex flex-col items-center"
                >
                  <span className="text-xl mb-1">♻️</span>
                  <span>Green Bin</span>
                </button>
                <button
                  onClick={() => handleBinSelection('blue')}
                  className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-2 rounded flex flex-col items-center"
                >
                  <span className="text-xl mb-1">♻️</span>
                  <span>Blue Box</span>
                </button>
                <button
                  onClick={() => handleBinSelection('garbage')}
                  className="flex-1 bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-2 rounded flex flex-col items-center"
                >
                  <span className="text-xl mb-1">🗑️</span>
                  <span>Garbage</span>
                </button>
              </div>
              
              {feedback && (
                <div className="mt-4 text-xl font-bold" style={{ color: feedbackColor }}>
                  {feedback}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default GarbageSortingGame;