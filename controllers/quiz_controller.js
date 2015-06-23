// Controlador quiz

// Importa modelos
var models = require('../models/models.js');

// Autoload - factoriza el código si la ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.find(quizId).then(
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
			res.render('quizes/index', {quizes: 
				// Si se introdujo cadena de búsqueda entonces ordena quizes alfabéticamente:
				(patron === '%') ? quizes : quizes.sort(function(a,b){ return a.pregunta.toLowerCase().localeCompare(b.pregunta.toLowerCase()); })
			});
		}
	).catch(function(error) { next(error);});
};

// GET /quizes/:id
exports.show = function(req, res) {
	models.Quiz.find(req.params.quizId).then(function(quiz) {
		res.render('quizes/show', {quiz: req.quiz});
	})
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta) {
		resultado = 'Correcto';
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};

// GET /author
exports.author = function(req, res) {
	res.render('author');
};