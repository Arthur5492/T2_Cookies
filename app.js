import { connect_db, update_profile, insert_cookie, giveaway } from './src/db/mongodb.js';
import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.static(__dirname + "/public"));
app.use(express.json());

app.get('/', function(req,resp) {
    resp.send();
});

app.get('/db', function(req, resp) {
  connect_db();
  giveaway();
  console.log('conectou');
});

app.listen(3000, function(){
    console.log('Servidor rodando na porta 3000');
});

app.get(/^(.+)$/, function (req, res) {
    try {
      res.write("A pagina que vc busca nao existe")
      res.end();
    }
    catch(e) {
      res.end();
    }    
});
