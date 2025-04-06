import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";

const RedBackgroundSpan = styled("span")({
  backgroundColor: "red",
});

const BlueTextSpan = styled("span")({
  color: "blue",
});

function generateRandomNumbersForString(inputString) {
  const length = inputString.length;
  const randomNumbers = Array.from({ length }, () => Math.random());
  return randomNumbers;
}

const CustomText = ({ text, markLowConfidence }) => {
  // Split the text by brackets, including the brackets themselves
  const parts = text.split(/(\[.*?\])/);
  let wordIndex = 0;
  const [numbers, setNumbers] = useState([]);
  useEffect(() => {
    setNumbers((oldNumbers) => [
      ...oldNumbers,
      ...generateRandomNumbersForString(text.slice(numbers.length)),
    ]);
  }, [text]);

  console.log("numbers", numbers);
  return (
    <Typography
      sx={{
        textAlign: "center",
        border: "1px solid black",
        padding: "8px",
        margin: "10px 0",
      }}
    >
      {parts.map((part, index) => {
        if (part.startsWith("[") && part.endsWith("]")) {
          // Remove the brackets and apply the red background
          const content = part.slice(1, -1);
          return (
            <RedBackgroundSpan key={index}>
              {content.split(" ").map((word, i) => {
                const number = numbers[wordIndex];
                wordIndex++;
                if (number < 0.25 && markLowConfidence) {
                  return <BlueTextSpan key={i}>{word} </BlueTextSpan>;
                }
                return <span key={i}>{word} </span>;
              })}
            </RedBackgroundSpan>
          );
        }
        // Render the part as normal text
        return part.split(" ").map((word, i) => {
          const number = numbers[wordIndex];
          wordIndex++;
          if (number < 0.25 && markLowConfidence) {
            return <BlueTextSpan key={i}>{word} </BlueTextSpan>;
          }
          return <span key={i}>{word} </span>;
        });
      })}
    </Typography>
  );
};

export default CustomText;
