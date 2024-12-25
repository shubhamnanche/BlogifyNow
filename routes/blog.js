const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Blog = require("../models/blog");
const Comment = require("../models/comment");

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = `./public/uploads/${req.user._id}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, path.resolve(dir));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    req.fileName = fileName;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
  return res.render("addBlog", { user: req.user });
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;
  const dir = `/public/uploads/${req.user._id}/${req.fileName}`;

  const blog = await Blog.create({
    title,
    body,
    createdBy: req.user._id,
    coverImageURL: dir,
  });

  console.log("Blog", blog);

  return res.redirect(`/blog/${blog._id}`);
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById({ _id: req.params.id }).populate(
    "createdBy"
  );

  const comments = await Comment.find({ blogId: req.params.id }).populate(
    "createdBy"
  );

  console.log("Blog", blog);
  console.log("Comments", comments);

  return res.render("blog", {
    user: req.user,
    blog: blog,
    comments: comments,
  });
});

router.post("/comment/:blogId", async (req, res) => {
  const comment = await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });

  return res.redirect(`/blog/${req.params.blogId}`);
});

module.exports = router;
