const express = require("express");

const router = express.Router();
const Post = require("../models/post");

router.post("", (req, res, next) => {
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

router.get("", (req, res, next) => {
  console.log("fetch entered");
  Post.find().then((documents) => {
    console.log(documents);
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: documents,
    });
  });
});

router.put("/:postId", (req, res, next) => {
  console.log("delete entered");
  const postId = req.params.postId;
  const updatedPost = {
    title: req.body.title,
    content: req.body.content,
  };
  Post.findByIdAndUpdate(postId, updatedPost, { new: true })
    .then((result) => {
      if (!result) {
        return res.status(404).json({ message: "Post not found!" });
      }
      res.status(200).json({
        message: "Post updated successfully!",
        post: result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Updating post failed." });
    });
});

router.delete("/:postId", (req, res, next) => {
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

module.exports = router;
