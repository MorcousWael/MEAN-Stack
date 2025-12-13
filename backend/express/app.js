const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const { default: mongoose } = require("mongoose");
const postRoutes = require("../routes/posts");

require("dotenv").config();

const app = express();
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join(__dirname, "../images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST,PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});
app.use("/api/posts", postRoutes);

module.exports = app;
