const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilities/asyncWrap.js");
const passport = require("passport");
const { saveRedirect } = require("../middleware.js");
const userControllers = require("../controllers/users.js");

router
  .route("/signup")
  .get(userControllers.renderSignUpForm)
  .post(wrapAsync(userControllers.signUp))


router
  .route("/login")
  .get(userControllers.renderLoginForm)
  .post( 
    saveRedirect,
    passport.authenticate("local",{
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userControllers.login
  )

router.get("/logout",
  userControllers.logout
);

module.exports = router;