import { type } from "@testing-library/user-event/dist/type";
import React, { createContext, useContext, useState, useCallback } from "react";

export const GameContext = createContext(null);

export default function useGameContext() {
  return useContext(GameContext);
}


export function GameProvider(props) {
  const [cards, setCards] = useState([]);
  const [activePlayer, setActivePlayer] = useState({
    name: null,
    isHost: false,
    team: null,
    role: null,
  });
  const [gameStatus, setGameStatus] = useState(null);
  const [players, setPlayers] = useState([]);
  const [winningTeam, setWinningTeam] = useState(null);
  const [clue, setClue] = useState("");

  const createCards = useCallback((words) => {
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
    
    let cards = words.map((word, idx) => {
      let type;
      let color;
      if (idx <= 5) {
        type = "red";
        color = "red";
      } else if (idx <= 11) {
        type = "blue";
        color = "blue";
      } else if (idx === 12) {
        type = "bomb";
        color = "gray";
      } else {
        type = "neutral";
        color = "beige";
      }
      return {
        word,
        type,
        color,
        isFaceUp: false,
      };
    });

   
  

    shuffleArray(cards);
    setCards(cards);
    return cards;
  }, []);

  const [activeTeam, setActiveTeam] = useState("red");
  const [selectedCard, setSelectedCard] = useState({});

  function resetGame (){
    setCards(null);
    setActivePlayer(null);
    setGameStatus(null);
    setPlayers(null);
    setWinningTeam(null);
    setClue(null);
   }
  return (
    <GameContext.Provider
      value={{
        cards,
        setCards,
        activePlayer,
        setActivePlayer,
        gameStatus,
        setGameStatus,
        players,
        setPlayers,
        activeTeam,
        setActiveTeam,
        setWinningTeam,
        winningTeam,
        clue,
        setClue,
        createCards,
        setSelectedCard,
        selectedCard,
        resetGame,
      }}
    >
      {props.children}
    </GameContext.Provider>
  );
}
