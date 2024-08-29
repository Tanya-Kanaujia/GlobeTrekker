/** @format */

const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
	const allListings = await Listing.find({});
	res.render("listings/index.ejs", { allListings });
};

module.exports.newFormRender = (req, res) => {
	res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
	let { id } = req.params;
	let listing = await Listing.findById(id)
		.populate({ path: "reviews", populate: { path: "author" } })
		.populate("owner");
	if (!listing) {
		req.flash("error", "Listing not Found!");
	} else {
		res.render("listings/show.ejs", { listing });
	}
};

module.exports.createListing = async (req, res, next) => {
	let url = req.file.path;
	console.log(url);
	let filename = req.file.filename;
	const newListing = new Listing(req.body.listing);
	newListing.owner = req.user._id;
	newListing.image = { url, filename };
	let savedListing = await newListing.save();
	console.log(savedListing);
	req.flash("success", "New Listing Added successfully!");
	res.redirect("/listings");
	next();
};

module.exports.renderEditForm = async (req, res) => {
	let { id } = req.params;
	const listing = await Listing.findById(id);
	if (!listing) {
		req.flash("error", "Listing not found!");
		res.redirect("/listings");
	}
	let originalImage = listing.image.url;
	originalImage = originalImage.replace("/upload", "/upload/w_250");
	res.render("listings/edit.ejs", { listing, originalImage });
};

module.exports.updateListing = async (req, res) => {
	let { id } = req.params;
	let listing = await Listing.findById(id);
	await Listing.findByIdAndUpdate(id, { ...req.body.listing });
	if (typeof req.file !== "undefined") {
		let url = req.file.path;
		let filename = req.file.filename;
		listing.image = { url, filename };
		await listing.save();
	}
	req.flash("success", "Listing Updated!");
	res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
	let { id } = req.params;
	let deletedListing = await Listing.findByIdAndDelete(id);
	console.log(deletedListing);
	req.flash("success", "Listing Deleted!");
	res.redirect("/listings");
};
