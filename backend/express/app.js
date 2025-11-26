const express = require("express");
const bodyParser = require("body-parser");
const Post = require("../models/post");
const { default: mongoose } = require("mongoose");
require("dotenv").config();

const app = express();
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });

  post
    .save()
    .then((createdPost) => {
      console.log("db and collection made");
      res.status(201).json({
        message: "Post added successfully",
        post: createdPost, // <-- include the saved post here
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Creating post failed!" });
    });
});

app.get("/api/posts", (req, res, next) => {
  console.log("fetch entered");
  Post.find().then((documents) => {
    console.log(documents);
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: documents,
    });
  });
});

app.delete("/api/posts/:postId", (req, res, next) => {
  const postId = req.params.postId;

  console.log("delete entered");
  Post.findByIdAndDelete(postId)
    .then(() => {
      res.status(200).json({ message: "Post deleted!" });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Deletion failed!" });
    });
});

module.exports = app;
