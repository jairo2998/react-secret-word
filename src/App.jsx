
// CSS
import './App.css'

// Rect
import { useCallback, useEffect, useState } from 'react'

//Data
import {wordList} from "./data/words";

// components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"},
];

const guessesQty = 3;

function App() {
  const [gameStage, setGameSatge] = useState(stages[0].name);
  const [words] = useState(wordList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, SetPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);

  const pickWordAndCategory = () =>{
    // pick random category
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];

    // pick random word
    const word = words[category][Math.floor(Math.random() * words[category].length)]; 

    return {word, category};  
  };

  //Starts the secret game
  const startGame = useCallback(() => {
    //pick word and pick category
    const {word, category} = pickWordAndCategory();
    
    //create an array of letters
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((l) => l.toLowerCase());

   // fill states
   setPickedWord(word);
   SetPickedCategory(category);
   setLetters(wordLetters);
    
    setGameSatge(stages[1].name);
  });
  
  // Função para remover acentos
const normalizeChar = (char) => 
  char.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();


  // process the letter input
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();
    
    //check if letter is already guessed
    if (
      guessedLetters.includes(normalizedLetter) || 
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    };

    // push guessed letter or remove a guess
    if(letters.includes(normalizedLetter)){
      setGuessedLetters((actualGuessedLetters) => [...actualGuessedLetters, normalizedLetter]);
    } else {
      setWrongLetters((actualWrongLetters) => [...actualWrongLetters, normalizedLetter]);
      setGuesses((actualGuesses) => actualGuesses - 1);
    }    
  };

  const clearStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);    
    setGuesses(guessesQty);
  }

  useEffect(() => {
    if(guesses <= 0){
      //reset all states
      clearStates();
      setGameSatge(stages[2].name);
    }
  }, [guesses]);

  // check win condition
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];

    //win condition
    if(guessedLetters.length === uniqueLetters.length && gameStage === stages[1].name){
      //add score
      setScore((actualScore) => actualScore += 100);

      //restart game with new word
      clearStates();
      startGame();
    }

  }, [guessedLetters, letters, startGame]); 

  // Restarts the game
  const retry = () => {
    setScore(0);
    clearStates();
    setGameSatge(stages[1].name)
  };
 
  return (
    
    <div className='App'>
      {gameStage === 'start' && <StartScreen startGame={startGame}/>}
      {gameStage === 'game' && <Game verifyLetter={verifyLetter} 
                                     pickedWord={pickedWord}
                                     pickedCategory={pickedCategory}
                                     letters={letters}
                                     guessedLetters={guessedLetters}
                                     wrongLetters={wrongLetters}
                                     guesses={guesses}
                                     score={score}
      />}

      {gameStage === 'end' && <GameOver retry={retry} score={score}/>}
    </div>      
    
  );
}

export default App
