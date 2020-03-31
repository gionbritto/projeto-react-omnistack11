const express = require('express'); //importa todas as dependencias necessarias do express
const cors = require('cors')
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(3333); //vai ouvir a aplicacao na porta 3333
