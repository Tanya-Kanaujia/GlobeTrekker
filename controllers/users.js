/** @format */

const User = require("../models/user");

module.exports.renderSignUpForm = (req, res) => {
	res.render("./user/user.ejs");
};

module.exports.signUp = async (req, res, next) => {
	try {
		let { username, email, password } = req.body;
		let newUser = new User({ email, username });
		let registeredUser = await User.register(newUser, password);
		console.log(registeredUser);
		req.login(registeredUser, (err) => {
			if (err) {
				return next(err);
			}
			req.flash("success", "Welcome to GlobeTrekker!");
			res.redirect("/listings");
		});
	} catch (e) {
		req.flash("error", e.message);
		res.redirect("/signup");
	}
};

module.exports.renderLoginForm = (req, res) => {
	res.render("user/login.ejs");
};

module.exports.login = async (req, res) => {
	req.flash("success", "You Logged in!");
	const redirect = res.locals.redirectLink || "/listings";
	res.redirect(redirect);
};

module.exports.logout = (req, res, next) => {
	req.logOut((e) => {
		if (e) {
			return next(e);
		} else {
			req.flash("success", "You Logged Out!");
			res.redirect("/listings");
		}
	});
};
