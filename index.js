const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;

mongoose.connect("mongodb://127.0.0.1:27017/blogwebsite").then((e) => {
  console.log("Mongo DB connected!");
});

const userRoute = require("./routes/user");

app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use("/user", userRoute);

app.get("/", (req, res) => res.render("home"));

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
