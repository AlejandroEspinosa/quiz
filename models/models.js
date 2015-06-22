var path = require('path');

// Carga modelo ORM
var Sequelize = require('sequelize');

// Creación conexión SQLite
var sequelize = new Sequelize(null, null, null,
		{dialect: "sqlite", storage: "quiz.sqlite"}
	);

// Importación definición tabla Quiz
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

// Exportación definición tabla Quiz
exports.Quiz = Quiz;

// sequelize.sync() sincroniza si existe o crea la tabla
sequelize.sync().success(function() {
	Quiz.count().success(function(count) {
		if (count === 0) {
			Quiz.create({ pregunta: 'Capital de Italia',
						  respuesta: 'Roma'
			})
			.success(function() {console.log('Base de datos inicializada')});
		};
	});
});