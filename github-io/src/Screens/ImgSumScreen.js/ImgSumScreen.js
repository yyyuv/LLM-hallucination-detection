import React from "react";
import { Typography, Container, Box, Button } from "@mui/material";

function ImgSumScreen({
  imgLink,
  probesAndAnswers,
  totalPoints,
  renderNewExperiment,
}) {
  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{ mt: 4, textAlign: "center" }}
    >
      <Typography
        variant="h6"
        sx={{
          textAlign: "left",
          mt: 2,
          color:
            totalPoints === 0 ? "black" : totalPoints < 0 ? "red" : "green",
        }}
      >
        Points: {totalPoints}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src={imgLink} // Use index to access the correct image link
          alt="Descriptive text about the image"
          style={{ maxWidth: "100%", height: "auto" }}
        />
        <Typography
          variant="body1"
          sx={{
            mt: 2,
            color: probesAndAnswers[0].isCorrect ? "green" : "red",
          }}
        >
          You {probesAndAnswers[0].isCorrect ? "won" : "lost"} the{" "}
          {probesAndAnswers[0].gainedPoints} points you bet on the statement{" "}
          {probesAndAnswers[0].probe}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mt: 2,
            color: probesAndAnswers[1].isCorrect ? "green" : "red",
          }}
        >
          You {probesAndAnswers[1].isCorrect ? "won" : "lost"} the{" "}
          {probesAndAnswers[1].gainedPoints} points you bet on the statement{" "}
          {probesAndAnswers[1].probe}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            mt: 2,
            fontWeight: "bold",
            color:
              probesAndAnswers[0].gainedPoints +
                probesAndAnswers[1].gainedPoints >
              0
                ? "green"
                : "red",
          }}
        >
          YOU HAVE{" "}
          {probesAndAnswers[0].gainedPoints + probesAndAnswers[1].gainedPoints >
          0
            ? "WON"
            : "LOST"}{" "}
          {probesAndAnswers[0].gainedPoints + probesAndAnswers[1].gainedPoints}{" "}
          POINTS
        </Typography>
        <Typography
          variant="h6"
          sx={{
            mt: 2,
            fontWeight: "bold",
            color: totalPoints > 0 ? "green" : "red",
          }}
        >
          YOU HAVE {totalPoints} POINTS
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
          onClick={() => renderNewExperiment()}
        >
          Next Image
        </Button>
      </Box>
    </Container>
  );
}

export default ImgSumScreen;
