import express = require('express');
import bodyParser = require('body-parser');

// Controllers (route handlers)
import * as mainController from "./controllers/main";

const app = express();

var engines = require('consolidate');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', './server/views');
app.engine('html', engines.mustache);
app.set('view engine', 'html');

app.get('/', mainController.index);
app.get('/login', mainController.login);
app.get('/test', mainController.test);
app.get('/test/u/:id', mainController.test_logined);
app.post('/create', mainController.create);

let server = app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});

module.exports = { app, server }
