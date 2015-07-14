// Controlador statistic

// Importa modelos
var models = require('../models/models.js');

// GET /quizes/statistics
exports.index = function(req, res) {
	var stat = {};
	models.Quiz.count().then(
		function(count) {
			stat.num_quizes = count;
			models.Comment.count()
			.then(
				function(count) {
					stat.num_comments = count;
					models.sequelize.query('SELECT count(*) AS n FROM "Quizzes" WHERE "id" IN (SELECT DISTINCT "QuizId" FROM "Comments")')
					.then(
						function(count) {
							stat.num_quizes_with_comments = count[0][0].n;
							models.sequelize.query('SELECT count(*) AS n FROM "Comments" WHERE NOT "publicado"')
							.then(
								function(count) {
									res.render('statistics/index', {
										num_quizes: stat.num_quizes,
										num_comments: stat.num_comments,
										num_quizes_with_comments: stat.num_quizes_with_comments,
										num_comments_not_published: count[0][0].n,
										errors: []
									});
								}
							);//.catch(function(error) { next(error);});
						}
					);//.catch(function(error) { next(error);});
				}
			);//.catch(function(error) { next(error);});
		}
	).catch(function(error) { next(error);});
};





/*
models.Quiz.count().then(function(count){
    .....
    return models.Coment.count();
}).then(function(count){
    .....
    return sequelize.query(...);
}).then(function(count){
    .....
}).catch(function(error){next(error)});
*/