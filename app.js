var express = require('express');
var app = express();

app.use(express.static(__dirname + "/public"));
app.use(express.json());

app.get('/', function(req,resp) {
    resp.send();
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
