const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const Blog = require("./models/blog");

const app = express();
const PORT = 3000;

mongoose.connect("mongodb://127.0.0.1:27017/blogwebsite").then((e) => {
  console.log("Mongo DB connected!");
});

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use("/public", express.static(path.resolve("./public")));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({}).populate("createdBy");
  // console.log(allBlogs);
  const sortedBlogs = allBlogs.sort((a, b) =>
    a.createdAt > b.createdAt ? -1 : 1
  );

  res.render("home", {
    user: req.user,
    blogs: sortedBlogs,
  });
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
