const express = require("express"); // importando express
const app = express(); // iniciando express
const bodyParser = require("body-parser"); // serve para disponibilar/pegar as coisa q estao no body e usar dentro das rotas
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");

//Database
connection.authenticate().then(() =>{
    console.log("Conexao feita com o BD...");
}).catch((msgErro) =>{
    console.log("ERRO!!");
})

//ele fala pro express usar o EJS como view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));
//body Parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//rotas
app.get ("/", (req, res) => {
    Pergunta.findAll({raw: true, order:[
        ['id', 'DESC']// ordena as perguntas em ordem crescente, ASC ordena por ordem crescente
    ]}).then((perguntas) => {
        res.render("index",{
            perguntas: perguntas
        });
    }); // Ele basicamente busca todas perguntas no Banco de dados
     
})

app.get("/perguntar", (req, res) =>{
    res.render("perguntar");
})

app.post("/salvarpergunta", (req, res) => {
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect("/");
    });
})

app.get("/pergunta/:id", (req, res) => {
    var id = req.params.id;
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta => {
        if(pergunta != undefined){//pergunta achada

            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order:[
                    ['id', 'DESC']
                ]
            }).then(respostas =>{
                res.render("pergunta", {
                    pergunta: pergunta, 
                    respostas: respostas
                });
            });
        }else{//pergunta não encontrada
            res.redirect("/");
        }
    });
})

app.post("/responder", (req, res) =>{
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;

    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/pergunta/" +perguntaId);
    });

});


app.listen(8080,() =>{
        console.log("Servidor iniciado com sucesso!");
})

//REQ => DADOS ENVIADOS PELO USUARIO
//RES => RESPOSTA QUE VAI SER ENVIADA PARA O USUARIO



