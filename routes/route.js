const router = require("express").Router();
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("useCreateIndex", true);
const URL = process.env.MONGO_URI;

mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("connected successfully");
});

const wordSchema = new mongoose.Schema({
  word: { type: String, text: true },
  definition: { type: String, text: true },
});

const Word = mongoose.model("Word", wordSchema);

router.post("/add_word", async (req, res) => {
  const newWord = new Word(req.body);
  console.log(req.body);
  try {
    await newWord.save();
    res.send(newWord);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/words", async (req, res) => {
  const content = await Word.find({});
  try {
    res.json(content);
  } catch (error) {
    res.json({ error: "something went wrong!" });
  }
});

router.get("/word/:word", async (req, res) => {
  try {
    const word = await Word.findOne(req.params);
    console.log(req.params);
    res.json(word);
    /* console.log(req.params);
    res.send(word); */
  } catch (error) {
    res.json({ error: "word does not exist" });
  }
});

wordSchema.index({ word: "text", definition: "text" });
router.get("/search/:searchString", async (req, res) => {
  try {
    const foundWord = await Word.find({
      $text: { $search: req.params.searchString },
    });
    res.json(foundWord);
  } catch (error) {
    res.json({ error: "word does not exist" });
  }
});

module.exports = router;
