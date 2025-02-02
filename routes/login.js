var express = require('express');
var router = express.Router();
const passport = require("passport");

/* GET users listing. */
	
	// login view
	router.get('/', (req, res) => {
		console.log("Se ejecuta?");
		res.render('login.ejs', {
			message: req.flash('loginMessage')
		});
	});

	router.post('/', passport.authenticate('local-login', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true
	}));


module.exports = router;