import React, { useEffect } from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import useGameContext from "../../../context/GameContext";
import Card from "./Card";
import Box from "@mui/material/Box";

function GameBoard({ sendSelectedCard, endTurn }) {
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: "5px",
    margin: "5px",
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));
  const {
    activePlayer,
    setSelectedCard,
    activeTeam,
    selectedCard,
    cards,
    btnCounter,
  } = useGameContext();

  useEffect(() => {
    if (btnCounter === 0 && activePlayer.isHost) {
      endTurn();
    }
  }, [activePlayer, btnCounter, endTurn]);

  return (
    <>
      {activePlayer.name}, {activeTeam}
      <Grid
        justifyContent="center"
        container
        // spacing={{ xs: 0, md: 1 }}
        columns={{ xs: 1, sm: 9, md: 12 }}
      >
        {cards.map((card, index) => (
          <Grid flexGrow={1} item xs={2} sm={3} md={3} key={index}>
            <Item
              sx={{ cursor: "pointer" }}
              onClick={() =>
                card === selectedCard
                  ? setSelectedCard(null)
                  : setSelectedCard(card)
              }
            >
              <Card card={card}></Card>
            </Item>
          </Grid>
        ))}
      </Grid>
      {activePlayer.role === "operative" && activePlayer.team === activeTeam && (
        <Box
          my={1}
          display="flex"
          flexDirection="row"
          justifyContent="space-evenly"
        >
          <Button
            variant="contained"
            onClick={() => {
              sendSelectedCard(selectedCard);
            }}
          >
            Flip Card
          </Button>
          <Button variant="contained" color="error" onClick={() => endTurn()}>
            End Turn
          </Button>
        </Box>
      )}
      {activePlayer.role === "operative" && (
        <h3 style={{ color: "black" }}>{btnCounter} guesses left</h3>
      )}
    </>
  );
}

export default GameBoard;
