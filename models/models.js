var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// sqlite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name		= (url[6]||null);
var user		= (url[2]||null);
var pwd			= (url[3]||null);
var protocol 	= (url[1]||null);
var dialect 	= (url[1]||null);
var port 		= (url[5]||null);
var host 		= (url[4]||null);
var storage = process.env.DATABASE_STORAGE;

// Carga modelo ORM
var Sequelize = require('sequelize');

// Creación conexión BDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
	{ 	dialect: 	protocol,
		protocol: 	protocol,
		port: 		port,
		host: 		host,
		storage: 	storage, 	// solo para SQLite
		omitNull: 	true		// solo Pastgres
	}
);


// Importación definición tabla Quiz
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

// Exportación definición tabla Quiz
exports.Quiz = Quiz;

// sequelize.sync() sincroniza si existe o crea la tabla
sequelize.sync().then(function() { //cambiamos success por then al actualizar sequelize
	Quiz.count().then(function(count) {
		if (count === 0) {
			Quiz.create({ pregunta: 'Capital de Italia',
						  respuesta: 'Roma'
			});
			Quiz.create({ pregunta: 'Capital de Portugal',
						  respuesta: 'Lisboa'
			})
			.then(function() {console.log('Base de datos inicializada')});
		};
	});
});