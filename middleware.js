/** @format */

const { listingSchema } = require("./schema.js");
const ExpressError = require("./utilities/ExpressError.js");
const { reviewSchema } = require("./schema.js");
const Listing = require("./models/listing");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.session.redirectLink = req.originalUrl;
		req.flash("error", "You Must be Logged in to make changes");
		return res.redirect("/login");
	}
	next();
};

module.exports.saveRedirect = (req, res, next) => {
	if (req.session.redirectLink) {
		res.locals.redirectLink = req.session.redirectLink;
	}
	next();
};

module.exports.isOwner = async (req, res, next) => {
	let { id } = req.params;
	let listing = await Listing.findById(id);
	if (!listing.owner.equals(res.locals.currentUser._id)) {
		req.flash("error", "You Don't have permission to make changes!");
		return res.redirect(`/listings/${id}`);
	}
	next();
};

module.exports.validateListing = (req, res, next) => {
	let { error } = listingSchema.validate(req.body);
	console.log(error);
	if (error) {
		let errMsg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(400, errMsg);
	} else {
		next();
	}
};

module.exports.validateReview = (req, res, next) => {
	let { error } = reviewSchema.validate(req.body);
	console.log(error);
	if (error) {
		let errMsg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(400, errMsg);
	} else {
		next();
	}
};

module.exports.isReviewAuthor = async (req, res, next) => {
	let { id, reviewId } = req.params;
	let review = await Review.findById(reviewId);
	if (!review.author.equals(res.locals.currentUser._id)) {
		req.flash("error", "You are not the author of this review!");
		return res.redirect(`/listings/${id}`);
	}
	next();
};
