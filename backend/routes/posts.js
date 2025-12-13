const express = require("express");
const multer = require("multer");

const router = express.Router();
const Post = require("../models/post");

const mimeTypeMap = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = mimeTypeMap[file.mimetype];
    let error = null;
    if (!isValid) {
      console.log("Invalid MIME type!");
      error = new Error("INVALID MIME TYPE");
    }
    console.log("Saving file to folder: images");
    cb(error, "images");
  },

  filename: (req, file, cb) => {
    console.log(file.originalname);
    const filename = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-")
      .replace(/\.[^/.]+$/, "");
    const ext = mimeTypeMap[file.mimetype];
    cb(null, filename + "-" + Date.now() + "." + ext);
    console.log("Final filename:", `${filename}-${Date.now()}.${ext}`);
  },
});

router.post(
  "",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = `${req.protocol}://${req.get("host")}`;
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: `${url}/images/${req.file.filename}`,
    });

    post
      .save()
      .then((createdPost) => {
        console.log("db and collection made");
        res.status(201).json({
          message: "Post added successfully",
          post: {
            id: createdPost._id,
            title: createdPost.title,
            content: createdPost.content,
            imagePath: createdPost.imagePath,
          },
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ message: "Creating post failed!" });
      });
  }
);

router.put(
  "/:postId",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    console.log("put entered");
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = `${req.protocol}://${req.get("host")}`;
      imagePath = `${url}/images/${req.file.filename}`;
    }
    const postId = req.params.postId;
    const updatedPost = {
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
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
  }
);

router.get("", (req, res, next) => {
  console.log("fetch entered");
  Post.find().then((documents) => {
    // console.log(documents);
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: documents,
    });
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
