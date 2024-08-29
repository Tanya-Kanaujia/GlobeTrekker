const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utilities/asyncWrap.js");
const { isLoggedIn, validateListing, isOwner } = require("../middleware.js");
const listingControllers = require("../controllers/listings.js");
const multer  = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage })

router
.route("/")
  .get(
    wrapAsync(listingControllers.index)
  )
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingControllers.createListing )
  )

//New Route
router.get("/new",
  isLoggedIn,
  (listingControllers.newFormRender)
);

router
  .route("/:id")
  .get(
    wrapAsync(listingControllers.showListing)
  )
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingControllers.updateListing),
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingControllers.destroyListing)
  )

//Edit Route
router.get("/:id/edit",
  isLoggedIn,
  wrapAsync(listingControllers.renderEditForm)
);

module.exports = router;