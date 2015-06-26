var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');

// GET home page
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: [] });
});

// Autoload para rutas con parámetro :quizId
// Precarga la pregunta con id=quizId
router.param('quizId', quizController.load);

// Rutas de quizes
router.get('/quizes', 						quizController.index);
router.get('/quizes/:quizId(\\d+)', 		quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', 	quizController.answer);
router.get('/quizes/new',					quizController.new);
router.post('/quizes/create',				quizController.create);
router.get('/quizes/:quizId(\\d+)/edit', 	quizController.edit);
router.put('/quizes/:quizId(\\d+)', 		quizController.update);

// Otras rutas
router.get('/author', quizController.author);

module.exports = router;