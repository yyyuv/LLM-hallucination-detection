const {ImageIteration, ProbeIteration} = require('./types');

const express = require("express");
const { v4: uuidv4 } = require("uuid");
const app = express();
app.use(express.json());
const cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
const cors = require("cors");
// const { db } = require("./Data/db");

const { baseUrl } = require("./constants");
const { MongoClient } = require('mongodb');

const mongoose = require("mongoose");

const useLocal = false;
const url = useLocal ? baseUrl.client : baseUrl.deployedClient;
// Replace <username>, <password>, and <dbname> with your credentials and database name
const uri =
  "mongodb+srv://ohadca:xCFWpHIKSKIQzWUR@cluster0.yeyhgvl.mongodb.net/LLM?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB database connection established successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

const dataSchema = new mongoose.Schema(
  {
    userId: String,
    imageAdress: String,
    firstProbe: {
      probe: {
        probe: String,
        label: Boolean,
        context: String,
      },
      answer: String,
      answerTime: Number,
      betPoints: Number,
    },
    secondProbe:  {
      probe: {
        probe: String,
        label: Boolean,
        context: String,
      },
      answer: String,
      answerTime: Number,
      betPoints: Number,
    },
    timesForEachWord: [],
    modelType: String,
  },
  { timestamps: true }
);

const Data = mongoose.model("Data", dataSchema,'LLM EXPERIMANT RESULTS');  

// Routes

const port = process.env.PORT || 3080 ;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: `${url}`,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],

};
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Welcome to your Wix Enter exam!");
});

app.post("/submit", async (req, res) => {
  const newData = new Data({ userId: "1234", answer: true });
  console.log("newData", newData);
  try {
    await newData.save();
    res.status(201).json("Data saved successfully");
    console.log("Data saved successfully");
  } catch (error) {
    console.log("error", error);
    res.status(400).json(`Error: ${error}`);
  }
});

app.post("/submit-imageIteration", async (req, res) => {
  console.log("recived Data", req.body.imageIterations);
  console.log("recived Data", req.body.imageIterations['0']);
  res.header('Access-Control-Allow-Origin', url);
  res.header('Access-Control-Allow-Credentials', 'true');
  // ,'2','3','4','5','6','7','8','9'
  const arr = ['0','1','2','3','4','5','6','7','8','9'];
  arr.forEach(async (index)=>{
    console.log("this is index", index);
    console.log(req.body.imageIterations[index]);
    try {
      // await newData.save();
      const currData = req.body.imageIterations[index];
      const newData = new Data({
        userId: currData.userId,
        imageAdress: currData.imageAdress,
        firstProbe: {
          probe: {
            probe: currData.firstProbe.probe.probe,
            label: currData.firstProbe.probe.label,
            context: currData.firstProbe.probe.context,
          
          },
          answer: currData.firstProbe.answer,
          answerTime: currData.firstProbe.answerTime,
          betPoints: currData.firstProbe.betPoints,
        },
        secondProbe: {
          probe: {
            probe: currData.secondProbe.probe.probe,
            label: currData.secondProbe.probe.label,
            context: currData.secondProbe.probe.context,
          
          },
          answer: currData.secondProbe.answer,
          answerTime: currData.secondProbe.answerTime,
          betPoints: currData.secondProbe.betPoints,
        },
        timesForEachWord: currData.timesForEachWord,
        modelType: currData.modelType,
      });
      await newData.save().catch((error) => {
      res.status(400).json(`Error: ${error}`);
      });
    } catch (error) {
      // console.log("error", error);
      res.status(400).json(`Error: ${error}`);
    }
  });
  console.log("Data saved successfully");
  res.status(201).json("Data saved successfully");

  
});


// const mongoUri = 'mongodb://localhost:27017';
const dbName = 'LLM';
const collectionName = 'LLM DATA';
// const type DBLINE = {
//   image_link: String;
//   description: string;
//   hallucinations: string;
//   probe_1: string;
//   labal_1: boolean;
//   context_1: string;
//   probe_2: string;
//   labal_2: boolean;
//   context_2: string;
//   probe_3: string;
//   labal_3: boolean;
//   context_3: string;
//   probe_4: string;
//   labal_4: boolean;
//   context_4: string;
//   times_for_each_word: [];
//   model_type: string;

// };
const mapDataToClien = (randomDocs)=>{
  const clientData = randomDocs.map((doc)=>{
    const imageIteration = {
      image_link: doc.image_link,
      description: doc.description,
      hallucinations: doc.hallucinations,
      probes: [
        {
          probe: doc.probe_1,
          label: doc.label_1,
          context: doc.context_1,
        },
        {
          probe: doc.probe_2,
          label: doc.label_2,
          context: doc.context_2,
        },
        {
          probe: doc.probe_3,
          label: doc.label_3,
          context: doc.context_3,
        },
        {
          probe: doc.probe_4,
          label: doc.label_4,
          context: doc.context_4,
        },
      ],
      timesForEachWord: doc.times_for_each_word,
      modelType: doc.model_type,
    }
    return imageIteration;
  });
  return clientData;
};
// Function to get 10 random documents from MongoDB
async function getRandomDocuments() {

  const client = new MongoClient("mongodb+srv://ohadca:xCFWpHIKSKIQzWUR@cluster0.yeyhgvl.mongodb.net/?w=majority&appName=Cluster0");

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Get the total count of documents in the collection
    const count = await collection.countDocuments();
    // Generate an array of random skips
    const randomSkips = Array.from({ length: 10 }, () => Math.floor(Math.random() * count));
    // Get 10 random documents using aggregation
    const randomDocs = await collection.aggregate([
      { $sample: { size: 10 } }
    ]).toArray();
    // console.log('randomDocs.length ---> ', randomDocs.length);
    // console.log('randomDocs.length ---> ', randomDocs[0]);
    return mapDataToClien(randomDocs);
  } catch (err) {
    console.error(err);
  } finally {
    // await client.close();
  }
}
app.get("/user", (req, res) => {
  const userId = uuidv4();
  res.cookie("userId", userId).send({ id: userId });
});
// Endpoint to get 10 random documents
app.get('/random-docs', async (req, res) => {
  try {
    const userId = uuidv4();

    console.log('got into random-docs', req);
    res.header('Access-Control-Allow-Origin', url);
    res.header('Access-Control-Allow-Credentials', 'true');
    const randomDocs = await getRandomDocuments();
    console.log('got random-docs from magnose', randomDocs);
    res.json({randomDocs, userId});
  } catch (err) {
    console.log('random-docs error', err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});
//////
app.get("/probes", (req, res) => {
  const userId = req.cookies?.userId;
  if (!userId) {
    res.status(403).end();
    return;
  }
  res.send({ probes: db });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
