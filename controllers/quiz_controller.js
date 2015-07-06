// Controlador quiz

// Importa modelos
var models = require('../models/models.js');

// Autoload - factoriza el código si la ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.findOne({
			where: 	{ id: Number(quizId) },
			include: [{ model: models.Comment }]
		})
	.then(
		function(quiz) {
			if (quiz) {
				req.quiz = quiz;
				next();
			} else { next(new Error('No existe quizId=' + quizId));}
		}
	).catch(function(error) { next(error);});
};

// GET /quizes
exports.index = function(req, res) {
	var patron = req.query.search || '';
	patron = (patron !== '') ? '%' + patron.replace(/ /g, '%') + '%' : '%'; // Pone % al principio y al final, y reemplaza los espacios por %
	models.Quiz.findAll({where: ["pregunta like ?", patron]}).then(
			function(quizes) {
			res.render('quizes/index', {
				// Si se introdujo cadena de búsqueda entonces ordena quizes alfabéticamente:
				quizes: (patron === '%') ? quizes : quizes.sort(function(a,b){ return a.pregunta.toLowerCase().localeCompare(b.pregunta.toLowerCase()); }),
				errors: []
			});
		}
	).catch(function(error) { next(error);});
};

// GET /quizes/:id
exports.show = function(req, res) {
	models.Quiz.findById(req.params.quizId).then(function(quiz) {
		res.render('quizes/show', {quiz: req.quiz, errors: [] });
	})
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta) {
		resultado = 'Correcto';
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: [] });
};

// GET /quizes/new
exports.new = function(req, res) {
	var quiz = models.Quiz.build( // Crea un objeto quiz
		{pregunta: "", respuesta: "", tema: ""}
	);
	res.render('quizes/new', {quiz: quiz, errors: [] });
};

// POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);
	quiz
	.validate().then(
		function(err){
			if (err) {
				res.render('quizes/new', {quiz: quiz, errors: err.errors});
			} else {
				quiz
				// Guarda en BDD sólo campos pregunta y respuesta, evitando abusos:
				.save({fields: ["pregunta", "respuesta", "tema"]})
				.then(function(){ res.redirect('/quizes');})
			}
		}
	).catch(function(error){next(error)});
};

// GET /quizes/:id/edit
exports.edit = function(req, res) {
	var quiz = req.quiz; // req.quiz había sido cargado con autoload
	res.render('quizes/edit', {quiz: quiz, errors: [] });
};

// PUT /quizes/:id
exports.update = function(req, res) {
	req.quiz.pregunta  = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;
	console.log(req.quiz.tema);
	req.quiz
	.validate()
	.then(
		function(err){
			if (err) {
				res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
			} else {
				req.quiz
				// Guarda en BDD sólo campos pregunta y respuesta, evitando abusos:
				.save({fields: ["pregunta", "respuesta", "tema"]})
				.then(function(){ res.redirect('/quizes');})
			}
		}
	);
};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
	req.quiz
	.destroy()
	.then(function() { res.redirect('/quizes');})
	.catch(function(error) {next(error)});
};

// GET /author
exports.author = function(req, res) {
	res.render('author');
};