export class ProbeIteration {
    constructor() {
      this.probe = '';
      this.answer = '';
      this.answerTime = 0;
      this.betPoints = 0;
    }
    setProbe(probe) {
      this.probe = probe;
    }
    setAnswer(answer) {
      this.answer = answer;
    }
    setAnswerTime(answerTime) {
      this.answerTime = answerTime;
    }
    setBetPoints(betPoints) {
      this.betPoints = betPoints;
    }
  };
  
  export class ImageIteration {
    constructor() {
      this.userId = ''; 
      this.imageAdress = '';
      this.firstProbe = new ProbeIteration();
      this.secondProbe = new ProbeIteration();
      this.timesForEachWord = [];
      this.modelType = '';
    }
    setImageAdress(imageAdress) {
      this.imageAdress = imageAdress;
    }
    setFirstProbe(probe) {
      this.firstProbe = probe;
    }
    setSecondProbe(probe) {
      this.secondProbe = probe;
    }
    setTimesForEachWord(timesForEachWord) {
      this.timesForEachWord = timesForEachWord;
    }
    setModelType(modelType) {
      this.modelType = modelType;
    }
  };