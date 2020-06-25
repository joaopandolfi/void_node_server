const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
var bodyParser = require('body-parser')
var morgan = require("morgan")
var helmet = require("helmet")
var fs = require('fs');
var https = require('https');
var http = require('http')

const config = require('./configurations/constants')

console.log(".")
// Server
app.set('view engine', 'hbs');

// Nunjucks
let njk_env = nunjucks.configure("views", {
    autoescape: true,
    cache: false,
    express: app,
    watch: true
});

//Logs
app.use(morgan("common"))

// Security
app.use(helmet())

// Body parser
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())


console.log("[+] Starting ")
if(!config.Debug){
    // HTTPS
    console.log("[+] Using SSL ")
    var privateKey  = fs.readFileSync(config.SSL.Key, 'utf8');
    var certificate = fs.readFileSync(config.SSL.Cert, 'utf8');
    var credentials = {key: privateKey, cert: certificate};
}

// Public files
app.use('/', express.static('public'));

if (!config.Debug){
    // Listen server
    var httpsServer = https.createServer(credentials, app);

    // HTTPS
    httpsServer.listen(config.Ports.https, function () {
        console.log(`[+] Listening HTTPS at: ${config.Ports.https}`)
    });

    // HTTP
    var httpServer = http.createServer(function (req, res) {
        try{
            res.writeHead(301, { "Location": "https://" + req.headers['host'].replace("www.","") + req.url });
            res.end();
        }catch(e){
            res.writeHead(301,{"Location": "https://" +req.headers['host']});
            res.end();
        }
    })


    httpServer.listen(config.Ports.http, () =>{
        console.log(`[+] Listening HTTP at: ${config.Ports.http} and redirect to HTTPS`)
    });
}else {
    var httpServer = http.createServer(app)
 
    httpServer.listen(config.Ports.http, () =>{
        console.log(`[+] Listening HTTP at: ${config.Ports.http}`)
    });
}