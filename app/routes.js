// app/routes.js
var mysql = require('mysql');
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);

module.exports = function(app, passport) {
	

	app.get('/tomb', isLoggedIn, (req, func)=>{
	
	let tombamento = req.query.tombamento;
	console.log(tombamento);
		if(tombamento != '000000' && tombamento != undefined && tombamento != ''){
			connection.query("SELECT * FROM main WHERE tombamento='"+tombamento+"'", function(req0, res0){
				if(res0 != undefined && res0 != ""){
					console.log(res0)
					func.render('tomb', { finalHostname : res0 });
					valorFinal = res0;
				}else{
					if(res0 == "" && tombamento.toString().length == 6 && tombamento == parseInt(tombamento, 10)){
						connection.query("SELECT * FROM main", function(req2, res2){
							for(ind in res2){
								if(res2[ind].tombamento == null){
									console.log(parseInt(ind)+1)
									connection.query("UPDATE main SET tombamento ='"+tombamento+"', usuario ='"+req.user.username+"' WHERE id ="+(parseInt(ind)+1), function(req3, res3){});
										connection.query("SELECT * FROM main WHERE tombamento='"+tombamento+"'", function(req4, res4){
											console.log(res4 + "final");
											func.render('tomb', { finalHostname : res4 });
											valorFinal = res4;
										});
									return;
								}
							}
						});
					}
				}
	
			});
		}else{
			func.render('tomb', { finalHostname : 000000 });}

    });

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.render('login.ejs', { message: req.flash('loginMessage') });
		//res.render('index.ejs'); // load the index.ejs file
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/tomb', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', isLoggedIn, function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	app.get('/tomb', isLoggedIn, function(req, res) {
		res.render('tomb.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};



// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
