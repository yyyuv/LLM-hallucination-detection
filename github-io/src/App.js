import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";
import WelcomePage from "./Screens/WelcomePage/WelcomePage";
import ExperimentScreen from "./Screens/ExperimentScreen/ExperimentScreen";
import {deployServerPath, localServerPath} from './constans';
import  EndOfExperiment  from "./Screens/EndOfIterationScreen/EndOfExperimentScreen";

const App = () => {
  axios.defaults.withCredentials = true;
  const useLocalServer = false;
  const baseURL = useLocalServer ? localServerPath : deployServerPath;

  const [userId, setUserId] = useState([]);
  const [startExperiment, setStartExperiment] = useState(false);
  const [endExperiment, setEndExperiment] = useState(false);
  const [wordByWord, setWordByWord] = useState(false);
  const [markHallucinations, setmarkHallucinations] = useState(false);
  const [markLowConfidence, setmarkLowConfidence] = useState(false);
  const [dbIndex, setDbIndex] = useState(0);
  const [dab, setDab] = useState([]);
  const imageIterations = useRef([]);
  const [isEnableToStart, setIsEnableToStart] = useState(false);
  const hasData = useRef(false);
  function handleStart() {
    setStartExperiment(true);
  }

  function renderNewExperiment() {
    setDbIndex((prevIndex) => prevIndex + 1);
    if (dbIndex === 9) {
      setEndExperiment(true);
      console.log("Start Experiment");
    }
  }
  useEffect(() => {
    if(!useRef.current) {getProbes()};
  },[]);

  useEffect(()=> {
    if(dbIndex===10){
      console.log('imageIterations');
      console.log(imageIterations.current); 
      sendImageIterations();
      setDbIndex(0)
    } else {
      console.log('dbIndex', dbIndex);
    }
  },[dbIndex])

  const getProbes = () => {
    if(hasData.current) return;
    hasData.current = true;
    axios
      .get(`${baseURL}/random-docs`)
      .then((response) => {
        console.log(response.data)
        setDab(response.data.randomDocs);
        setUserId(response.data.userId);
        setIsEnableToStart(true)
      })
      .catch((error) => console.error(error));
  };

  const handleSubmitMongo = async () => {
    axios
      .post(`${baseURL}/submit`)
      .then(() => {
        console.log("Data submitted successfully");
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
      });
  };

  const handleFinishIteration = (imageIteration) => {
    imageIterations.current.push({...imageIteration, userId});
  };

  const sendImageIterations = async () => {
    axios
      .post(`${baseURL}/submit-imageIteration`, {
        imageIterations: {...imageIterations.current, userId: userId},   
      })
      .then(() => {
        console.log("Data submitted successfully");
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
      });};
      console.log(`userId: ${userId}`);
  const renderExp = () =>
    endExperiment ? (<EndOfExperiment userId={userId}/>) :
    !startExperiment ? (
      <WelcomePage
        handleStart={handleStart}
        handleWordByWord={setWordByWord}
        wordByWord={wordByWord}
        markHallucinations={markHallucinations}
        handleMarkHallucinations={setmarkHallucinations}
        markLowConfidence={markLowConfidence}
        handleMarkLowConfidence={setmarkLowConfidence}
        isEnableToStart={isEnableToStart}
      />
    ) : (
      <ExperimentScreen
        firstProbe={dab[dbIndex].probes[0]}
        secondProbe={dab[dbIndex].probes[1]}
        description={
          markHallucinations
            ? dab[dbIndex].hallucinations.replace("</s>", " ").replace("<0x0A><0x0A>", " ").replace("<0x0A>", " ")
            : dab[dbIndex].description.replace("</s>", " ").replace("<0x0A><0x0A>", " ").replace("<0x0A>", " ")
        }
        imgLink={dab[dbIndex].image_link}
        renderNewExperiment={renderNewExperiment}
        logits={dab[dbIndex].logits}
        wordByWord={wordByWord}
        markHallucinations={markHallucinations}
        markLowConfidence={markLowConfidence}
        sendImageIteration={handleFinishIteration}
        wordsProb={dab[dbIndex].wordsProb}
        sendImageIterations={sendImageIterations}
      />
    );

  return renderExp();
};

export default App;
