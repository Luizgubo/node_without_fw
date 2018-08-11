/* Uptime monitor allow users to enter urls they want monitored 
 and recieve alerts when those resources go down or come back up


 REST-FUL API*/

const config = require('./lib/config');


const http = require('http');
const https = require('https');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const fs = require('fs');
const handlers = require('./lib/handlers');
const helpers = require('./lib/helpers');



//  HTTP SERVER
const httpServer = http.createServer((request, response)  => {
    unifedServer(request,response);
})

httpServer.listen(config.httpPort, () => console.log(`Server listening on port ${config.httpPort} in ${config.envName} mode`))


//  HTTPS SERVER
let httpsServerOptions = {
    'key'  : fs.readFileSync('./https/key.pem'),
    'cert' : fs.readFileSync('./https/cert.pen')
}

const httpsServer = https.createServer(httpsServerOptions, (request, response)  => {
    unifedServer(request,response);
})

httpsServer.listen(config.httpsPort, () => console.log(`Server listening on port ${config.httpsPort} in ${config.envName} mode`))



//                                  unified server ////////


let unifedServer = (request, response) => {

    let parsed = url.parse(request.url, true);
    
    let path = parsed.pathname;
    let trimmedPath = path.replace(/^\/+|\/+$/g,'');


    let method = request.method.toLocaleLowerCase()

    let queryStringObject = parsed.query

    let headers = request.headers;

    let decoder = new StringDecoder('utf-8');
    let buffer = ''
    request.on('data', (data) => buffer+=decoder.write(data));

    request.on('end',() => {
        buffer+= decoder.end()



        let choosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound


        let data = {

            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'handlers': handlers,
            'payload' : helpers.parseJsonToObject(buffer)
        }
        
        choosenHandler(data, (statusCode, payload) => {
        
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
        
            payload = typeof(payload) == 'object' ? payload : {};
        
        
            let payloadString = JSON.stringify(payload);
        
            response.setHeader('Content-Type','application/json')
            response.writeHead(statusCode);
            response.end(payloadString);


                    //responses and logs

        console.log('returning this response', statusCode,payloadString);
        });

    
    
        console.log("Request received on path ",path," with ",
        method," method and query string object ", queryStringObject);
    })

}


router = {
    'notFound': handlers.notFound,
    'ping' : handlers.ping,
    'users': handlers.users
}