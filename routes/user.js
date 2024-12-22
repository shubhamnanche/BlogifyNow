const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;

  const user = await User.create({
    fullName: fullName,
    email: email,
    password: password,
  });

  console.log(user);

  return res.redirect("/");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.matchPassword(email, password);

  console.log("User ", user);

  return res.redirect("/");
});

module.exports = router;
