const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const swaggerUI = require("swagger-ui-express");
const swaggerFile = require("../swagger-output.json");
const cors = require('cors');

module.exports = () => {
	const app = express();

	app.set('port', process.env.PORT || config.get('server.port'));
	
    // Middlewares
    app.use(cors()); // Habilita o CORS para todas as rotas
	app.use(bodyParser.json());
	app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerFile));
	
	return app;
};
