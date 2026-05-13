require("colors");
var http = require("http");
var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var session = require("express-session");
var path = require("path");

const MongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectId;

// URL do seu MongoDB (Altere para a sua se for diferente)
const uri = 'mongodb+srv://fevetrano:15012007Fe@fecluster.2ud2m5j.mongodb.net/?appName=FeCluster';
const client = new MongoClient(uri);

var app = express();
app.use(express.static("./public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configuração de Sessão (Necessária para saber se é Admin ou Usuário)
app.use(session({
    secret: 'segredo-lab10',
    resave: false,
    saveUninitialized: true
}));

// Porta 3000 para nuvem, mude para 80 para rodar no seu PC (localhost) como o prof pediu
var port = 80; 

var server = http.createServer(app);

async function iniciar() {
    try {
        await client.connect();
        console.log("Conectado ao MongoDB (fullstack_db)!".green);
        
        // Mudança solicitada para fullstack_db
        var dbo = client.db("fullstack_db");
        var usuarios = dbo.collection("usuarios");
        var posts = dbo.collection("posts");
        var carros = dbo.collection("carros");

        // --- ROTAS INICIAIS ---
        app.get('/', function(req, res) {
            res.redirect('/lab02/projects.html');
        });

        // Caso tente o caminho antigo, redirecionamos para o novo
        app.get('/projects.html', function(req, res) {
            res.redirect('/lab02/projects.html');
        });

        // --- LAB 8: LOGIN E CADASTRO ---
        app.get('/login', function(req, res) {
            res.redirect('/lab08/login.html');
        });

        app.get('/cadastro', function(req, res) {
            res.redirect('/lab08/cadastro.html');
        });

        app.get('/cadastra', function(req, res) {
            res.redirect('/lab08/cadastro.html');
        });

        // Endpoint de Cadastro para o Lab 08
        app.post("/cadastrar_usuario_lab08", function(req, resp) {
            var data = { 
                db_nome: req.body.nome, 
                db_login: req.body.login, 
                db_senha: req.body.senha,
                isAdmin: false // Usuários normais no Lab 08
            };
            usuarios.insertOne(data)
                .then(function() {
                    resp.render('resposta', { resposta: "Lab 08: Usuário cadastrado com sucesso!" });
                })
                .catch(function(err) {
                    resp.render('resposta', { resposta: "Lab 08: Erro ao cadastrar usuário!" });
                });
        });

        // Endpoint de Login para o Lab 08 (Simples)
        app.post("/logar_usuario_lab08", function(req, resp) {
            var data = { db_login: req.body.login, db_senha: req.body.senha };
            usuarios.findOne(data)
                .then(function(user) {
                    if (!user) {
                        resp.render('resposta', { resposta: "Lab 08: Usuário ou senha incorretos!" });
                    } else {
                        req.session.user = user;
                        resp.render('resposta', { resposta: "Lab 08: Login realizado com sucesso! Bem-vindo, " + user.db_nome });
                    }
                })
                .catch(function(err) {
                    resp.render('resposta', { resposta: "Lab 08: Erro no login!" });
                });
        });

        // Mantendo os originais para o Lab 10
        app.post("/cadastrar_usuario", function(req, resp) {
            var data = { 
                db_nome: req.body.nome, 
                db_login: req.body.login, 
                db_senha: req.body.senha,
                isAdmin: req.body.isAdmin === 'on' 
            };
            usuarios.insertOne(data)
                .then(function() {
                    resp.render('resposta', { resposta: "Usuário cadastrado com sucesso!" });
                })
                .catch(function(err) {
                    resp.render('resposta', { resposta: "Erro ao cadastrar usuário!" });
                });
        });

        app.post("/logar_usuario", function(req, resp) {
            var data = { db_login: req.body.login, db_senha: req.body.senha };
            var destino = req.body.destino;

            usuarios.findOne(data)
                .then(function(user) {
                    if (!user) {
                        resp.render('resposta', { resposta: "Usuário/senha incorretos!" });
                    } else {
                        req.session.user = user;
                        if (destino === 'gerencia') {
                            if (user.isAdmin) {
                                resp.redirect('/gerenciar_carros');
                            } else {
                                resp.render('resposta', { resposta: "Acesso Negado: Apenas administradores podem gerenciar estoque!" });
                            }
                        } else {
                            resp.redirect('/carros');
                        }
                    }
                })
                .catch(function(err) {
                    resp.render('resposta', { resposta: "Erro no login!" });
                });
        });

        app.get('/logout', function(req, res) {
            req.session.destroy();
            res.redirect('/lab10/home.html');
        });

        // --- LAB 9: BLOG ---
        app.get('/blog', async function(req, res) {
            try {
                const allPosts = await posts.find({}).toArray();
                res.render('blog', { posts: allPosts });
            } catch (err) {
                res.render('resposta', { resposta: "Erro ao carregar o blog!" });
            }
        });

        app.get('/cadastrar_post', function(req, res) {
            res.redirect('/lab09/cadastrar_post.html');
        });

        app.post('/salvar_post', function(req, res) {
            var data = { 
                titulo: req.body.titulo, 
                resumo: req.body.resumo, 
                conteudo: req.body.conteudo, 
                data: new Date().toLocaleString('pt-BR') 
            };
            posts.insertOne(data)
                .then(function() {
                    res.redirect('/blog');
                })
                .catch(function(err) {
                    res.render('resposta', { resposta: "Erro ao salvar post!" });
                });
        });

        // --- LAB 10: SISTEMA DE CARROS ---
        app.get('/carros', async function(req, res) {
            if (!req.session.user) return res.redirect('/lab10/login.html?destino=loja');
            const allCars = await carros.find({}).toArray();
            res.render('carros_lista', { carros: allCars, user: req.session.user });
        });

        app.get('/gerenciar_carros', async function(req, res) {
            if (!req.session.user) return res.redirect('/lab10/login.html?destino=gerencia');
            if (!req.session.user.isAdmin) {
                return res.render('resposta', { resposta: "Área restrita para Administradores!" });
            }
            const allCars = await carros.find({}).toArray();
            res.render('carros_gerencia', { carros: allCars });
        });

        app.post('/add_carro', function(req, res) {
            if (!req.session.user || !req.session.user.isAdmin) return res.send("Acesso Proibido");
            var data = { 
                marca: req.body.marca, 
                modelo: req.body.modelo, 
                ano: parseInt(req.body.ano), 
                qtde_disponivel: parseInt(req.body.qtde_disponivel) 
            };
            carros.insertOne(data)
                .then(function() {
                    res.redirect('/gerenciar_carros');
                })
                .catch(function(err) {
                    res.render('resposta', { resposta: "Erro ao adicionar carro!" });
                });
        });

        app.post('/remover_carro', function(req, res) {
            if (!req.session.user || !req.session.user.isAdmin) return res.send("Acesso Proibido");
            carros.deleteOne({ _id: new ObjectId(req.body.id) })
                .then(function() {
                    res.redirect('/gerenciar_carros');
                })
                .catch(function(err) {
                    res.render('resposta', { resposta: "Erro ao remover!" });
                });
        });

        app.post('/atualizar_carro', function(req, res) {
            if (!req.session.user || !req.session.user.isAdmin) return res.send("Acesso Proibido");
            var query = { _id: new ObjectId(req.body.id) };
            var newData = { $set: { 
                marca: req.body.marca, 
                modelo: req.body.modelo, 
                ano: parseInt(req.body.ano), 
                qtde_disponivel: parseInt(req.body.qtde_disponivel) 
            }};
            carros.updateOne(query, newData)
                .then(function() {
                    res.redirect('/gerenciar_carros');
                })
                .catch(function(err) {
                    res.render('resposta', { resposta: "Erro ao atualizar!" });
                });
        });

        app.post('/vender_carro', async function(req, res) {
            if (!req.session.user) return res.render('resposta', { resposta: "Faça login para comprar!" });
            try {
                const car = await carros.findOne({ _id: new ObjectId(req.body.id) });
                if (car && car.qtde_disponivel > 0) {
                    await carros.updateOne(
                        { _id: new ObjectId(req.body.id) },
                        { $inc: { qtde_disponivel: -1 } }
                    );
                    res.redirect('/carros');
                } else {
                    res.render('resposta', { resposta: "AVISO: Carro Esgotado!" });
                }
            } catch (err) {
                res.render('resposta', { resposta: "Erro ao vender carro!" });
            }
        });

        server.listen(port, "0.0.0.0", function() {
            console.log(("Servidor rodando na porta " + port + " ...").rainbow);
        });

    } catch (e) {
        console.error(e);
    }
}

iniciar();