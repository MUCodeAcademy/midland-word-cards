import { io } from "socket.io-client";
import useGameContext from "../../src/context/GameContext";
import { useEffect, useRef } from "react";

export default function useSocket(lobby) {
  const { activePlayer, setPlayers, players, setActivePlayer, activeTeam } =
    useGameContext();
  const socketRef = useRef;
  useEffect(() => {
    socketRef.current = io("http://localhost:8080", {
      query: {
        name: activePlayer.name,
        isHost: activePlayer.isHost,
        lobby,
      },
    });

    socketRef.current.on("user connect", ({ name, isHost }) => {
      if (activePlayer.isHost) {
        setPlayers((curr) => {
          let newPlayers = [...curr, { name, isHost, team: null }];
          socketRef.current.emit("update players", newPlayers);
          return newPlayers;
        });
      }
    });
    socketRef.current.on("update players", (newPlayers) => {
      if (!activePlayer.isHost) {
        setPlayers(newPlayers);
      }
    });

    socketRef.current.on("join team", ({ player, team, role }) => {
      if (activePlayer.isHost) {
        console.log(player, team, role);
        setPlayers((curr) => {
          let newPlayers = curr.map((p) => {
            if (p.name === player.name) {
              p.team = team;
              p.role = role;
              console.log(p);
            }
            return p;
          });
          socketRef.current.emit("update players", newPlayers);
          return newPlayers;
        });
      }
    });

    socketRef.current.on("send selected card", (card) => {
      if (card.type === activeTeam) {
        //  continue turn
      } else if (card.type === "bomb") {
        // end game throw pop up
      } else {
        endTurn()
      }
    });

  }, []);


  return

  function joinTeam(player, team, role) {
    setActivePlayer((curr) => ({ ...curr, role, team }));
    socketRef.current.emit("join team", {
      player,
      team,
      role,
    });
  }

  function sendSelectedCard(card) {
    socketRef.current.emit("send selected card", (card));
  }

  function endTurn() {
    socketRef.current.emit("end turn")
  }

  return { joinTeam, sendSelectedCard };
}
