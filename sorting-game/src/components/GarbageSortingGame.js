import React, { useState, useEffect } from 'react';
import './GarbageSortingGame.css';

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
  const [activeBin, setActiveBin] = useState(null);

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

  // Keyboard shortcuts: 1 -> green, 2 -> blue, 3 -> garbage
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const onKeyDown = (e) => {
      // Support top-row digits and numpad
      if (e.key === '1' || e.code === 'Numpad1') {
        setActiveBin('green');
        handleBinSelection('green');
        setTimeout(() => setActiveBin(null), 140);
      } else if (e.key === '2' || e.code === 'Numpad2') {
        setActiveBin('blue');
        handleBinSelection('blue');
        setTimeout(() => setActiveBin(null), 140);
      } else if (e.key === '3' || e.code === 'Numpad3') {
        setActiveBin('garbage');
        handleBinSelection('garbage');
        setTimeout(() => setActiveBin(null), 140);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [gameStarted, gameOver, currentItem, score, round]);

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
    <div className="game-card">
      {!gameStarted ? (
        <div className="start-screen">
          <h1 className="title">Garbage Sorting Game</h1>
          <p className="lead">Sort the garbage items into the correct bins:</p>
          <ul className="rules">
            <li><strong className="label green">Green Bin:</strong> Compostable items (food scraps, plant matter)</li>
            <li><strong className="label blue">Blue Box:</strong> Recyclable items (paper, plastic, metal, glass)</li>
            <li><strong className="label gray">Garbage:</strong> Non-recyclable, non-compostable waste</li>
          </ul>
          <p className="muted">You have 60 seconds. Each correct answer gives you 10 points!</p>
          <button onClick={startGame} className="btn primary">Start Game</button>
        </div>
      ) : (
        <div className="game-area">
          <div className="stats">
            <div className="score">Score: <span className="score-value">{score}</span></div>
            <div className="time">Time: <span className="time-value">{timeLeft}s</span></div>
          </div>

          {gameOver ? (
            <div className="end-screen">
              <p className="game-over">Game Over!</p>
              <p className="big-score">Your Score: <span>{score}</span></p>
              <p className="muted">High Score: {highScore}</p>
              <button onClick={startGame} className="btn primary">Play Again</button>
            </div>
          ) : (
            <>
              <div className="interaction-area">
                {currentItem && (
                  <div className="item-card">
                    <div className="item-emoji" aria-hidden>{currentItem.image}</div>
                    <p className="item-name">{currentItem.name}</p>
                  </div>
                )}

                <div className="bins">
                  <button onClick={() => handleBinSelection('green')} className={`bin-btn green ${activeBin === 'green' ? 'pressed' : ''}`}>
                    <span className="key-badge">1</span>
                    <span className="bin-emoji">♻️</span>
                    <span>Green Bin</span>
                  </button>
                  <button onClick={() => handleBinSelection('blue')} className={`bin-btn blue ${activeBin === 'blue' ? 'pressed' : ''}`}>
                    <span className="key-badge">2</span>
                    <span className="bin-emoji">♻️</span>
                    <span>Blue Box</span>
                  </button>
                  <button onClick={() => handleBinSelection('garbage')} className={`bin-btn gray ${activeBin === 'garbage' ? 'pressed' : ''}`}>
                    <span className="key-badge">3</span>
                    <span className="bin-emoji">🗑️</span>
                    <span>Garbage</span>
                  </button>
                </div>

                <div className="feedback-wrap">
                  <div className="feedback" style={{ color: feedbackColor }}>
                    {feedback}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default GarbageSortingGame;