// Controlador session

// GET /login
exports.new = function(req, res) {
	var errors = req.session.errors || {};
	req.session.errors = {};
	res.render('sessions/new', {errors: errors});
};

// POST /login
exports.create = function(req, res) {
	var login = req.body.login;
	var password = req.body.password;
	var userController = require('./user_controller');
	if (error) {
		req.session.errors = [{"message": 'Se ha producido un error: ' + error}];
		res.redirect("/login");
		return;
	}
	// Crea req.session.user con parámetros id y username
	// Habá sesion si existe req.session.user
	req.session.user = {id: user.id, username: user.username};
	res.redirect(req.session.redir.toString()); // Redirección a la URL que originó el login
};

// DELETE /logout
exports.destroy = function(req, res) {
	delete req.session.user;
	res.redirect(req.session.redir.toString()); // Redirección a la URL anterior al logout
};